import bcrypt from "bcryptjs";
import { HttpException } from "@/utils/httpException";
import { generateTokenPair, verifyRefreshToken } from "@/utils/jwt";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateLastLogin,
} from "@/repositories/auth.repository";
import {
  createSession,
  deleteAllUserSessions,
  deleteSession,
  findSessionByRefreshToken,
  updateSession,
} from "@/repositories/session.repository";
import { LoginInput, RegisterInput } from "@/validations/auth.validation";
import { RequestMeta } from "@/types/util.type";

// Konfigurasi masa berlaku Refresh Token (7 hari)
const REFRESH_TOKEN_EXPIRES_DAYS = 7;

/**
 * Fungsi pembantu untuk mendapatkan tanggal kadaluarsa sesi
 */
const getExpiresAt = () => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);
  return expiresAt;
};

/**
 * Service untuk registrasi pengguna baru.
 * Mengecek duplikasi email dan mengenkripsi password.
 */
export const register = async (input: RegisterInput) => {
  // Cek apakah email sudah terdaftar
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new HttpException(409, "Email sudah terdaftar gunakan email lain");
  }

  // Hash password dengan salt 12 rounds
  const hashedPassword = await bcrypt.hash(input.password, 12);

  // Buat user di database
  const user = await createUser({
    email: input.email,
    password: hashedPassword,
    name: input.name ?? null,
  });

  return { user };
};

/**
 * Service untuk login pengguna.
 * Memvalidasi kredensial dan mengelola sesi (createSession).
 */
export const login = async (input: LoginInput, meta: RequestMeta) => {
  // Cari user berdasarkan email
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new HttpException(401, "Email atau password salah");
  }

  // Pastikan akun dalam status ACTIVE
  if (user.status !== "ACTIVE") {
    const statusMessages: Record<string, string> = {
      INACTIVE: "Akun Anda sedang dinonaktifkan",
    };
    throw new HttpException(
      403,
      statusMessages[user.status] ?? "Akun tidak dapat diakses"
    );
  }

  // Bandingkan password input dengan hash di database
  const isMatch = await bcrypt.compare(input.password, user.password);
  if (!isMatch) {
    throw new HttpException(401, "Email atau password salah");
  }

  // Buat sesi sementara untuk mendapatkan ID sesi
  const tempSession = await createSession({
    userId: user.id,
    refreshToken: `temp_${Date.now()}`, // Placeholder unik
    userAgent: meta.userAgent ?? null,
    ipAddress: meta.ipAddress ?? null,
    expiresAt: getExpiresAt(),
  });

  // Generate pair token (Access & Refresh) bawaan payload session
  const tokens = generateTokenPair({
    userId: user.id,
    email: user.email,
    role: user.role,
    sessionId: tempSession.id,
  });

  // Update session dengan Refresh Token yang asli
  await updateSession(tempSession.id, { refreshToken: tokens.refreshToken });

  // Catat waktu login terakhir
  await updateLastLogin(user.id);

  return {
    user: tempSession.user,
    tokens,
  };
};

/**
 * Service untuk logout (menghapus sesi aktif).
 */
export const logout = async (sessionId: string) => {
  await deleteSession(sessionId);
};

/**
 * Service untuk logout dari semua perangkat (hapus semua sesi user).
 */
export const logoutAll = async (userId: string) => {
  await deleteAllUserSessions(userId);
};

/**
 * Service untuk mendaftarkan ulang Access Token menggunakan Refresh Token.
 */
export const refresh = async (refreshToken: string, meta: RequestMeta) => {
  // Cari sesi berdasarkan refresh token
  const session = await findSessionByRefreshToken(refreshToken);
  if (!session || session.expiresAt < new Date()) {
    throw new HttpException(
      401,
      "Sesi berakhir atau Refresh Token tidak valid"
    );
  }

  // Verifikasi keaslian token
  const payload = verifyRefreshToken(refreshToken);
  if (payload.sessionId !== session.id) {
    throw new HttpException(401, "Ketidakcocokan sesi token");
  }

  // Generate ulang token pair
  const newTokens = generateTokenPair({
    userId: session.user.id,
    email: session.user.email,
    role: session.user.role,
    sessionId: session.id,
  });

  // Perbarui Refresh Token di database
  await updateSession(session.id, {
    refreshToken: newTokens.refreshToken,
    userAgent: meta.userAgent ?? null,
    ipAddress: meta.ipAddress ?? null,
    expiresAt: getExpiresAt(),
  });

  return { tokens: newTokens };
};

/**
 * Service untuk mendapatkan informasi profil user saat ini.
 */
export const me = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new HttpException(404, "Pengguna tidak ditemukan");
  }
  return { user };
};
