import { Request, Response, NextFunction } from "express";
import { extractTokenFromHeader, verifyAccessToken } from "@/utils/jwt";
import { findSessionById } from "@/repositories/session.repository";

/**
 * Middleware untuk mengecek token akses (JWT) pada header Authorization.
 * Memastikan token valid dan sesi user masih aktif di database.
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Ambil token dari header 'Authorization: Bearer <token>'
  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token akses tidak ditemukan, silakan login kembali",
    });
  }

  try {
    // Verifikasi tanda tangan JWT
    const payload = verifyAccessToken(token);

    // Cek apakah sesi masih ada di database (agar bisa di-revoke)
    const session = await findSessionById(payload.sessionId);
    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        message: "Sesi Anda telah berakhir atau tidak valid",
      });
    }

    // Masukkan data user dan sesi ke locals agar bisa diakses controller selanjutnya
    res.locals.user = session.user;
    res.locals.session = session;
    res.locals.payload = payload;

    next();
  } catch (err) {
    // Jika verifikasi token gagal (expired/manipulated)
    return res.status(401).json({
      success: false,
      message: "Token tidak valid atau sudah kadaluarsa",
    });
  }
};
