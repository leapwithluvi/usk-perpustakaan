import {
  findUserByIdRepo,
  updateUserRepo,
  findAllUsersRepo,
} from "@/repositories/user.repository";
import { HttpException } from "@/utils/httpException";
import { Prisma } from "@prisma";

/**
 * Service untuk mengambil data profil pengguna berdasarkan ID.
 * Melakukan validasi keberadaan pengguna di database.
 */
export const getUserProfile = async (id: string) => {
  if (!id) {
    throw new HttpException(400, "ID pengguna diperlukan untuk pencarian");
  }

  const user = await findUserByIdRepo(id);
  if (!user) {
    throw new HttpException(404, "Data profil pengguna tidak ditemukan");
  }

  return user;
};

/**
 * Service untuk memperbarui informasi profil pengguna.
 * Memastikan ID valid sebelum melakukan pembaruan di database.
 */
export const updateUserProfile = async (
  id: string,
  data: Prisma.UserUpdateInput
) => {
  if (!id) {
    throw new HttpException(400, "ID pengguna diperlukan untuk pembaruan");
  }

  // Pastikan user memang ada
  const existing = await findUserByIdRepo(id);
  if (!existing) {
    throw new HttpException(
      404,
      "Profil pengguna tidak ditemukan, pembaruan gagal"
    );
  }

  return await updateUserRepo(id, data);
};

/**
 * Service untuk mengambil daftar seluruh pengguna.
 * Biasanya digunakan oleh Admin untuk manajemen anggota.
 */
export const getAllUsers = async () => {
  return await findAllUsersRepo();
};
