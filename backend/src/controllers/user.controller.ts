import { NextFunction, Request, Response } from "express";
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} from "@/services/user.service";
import { responseSuccess } from "@/utils/response";
import { HttpException } from "@/utils/httpException";

/**
 * Controller untuk mengambil data profil milik pengguna.
 * Ada pengecekan agar user hanya bisa akses datanya sendiri (kecuali ADMIN).
 */
export const getUserProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestedId = res.locals.parsed.params.id;
    const loggedInUser = res.locals.user;

    // Keamanan: Pastikan user hanya melihat profil miliknya sendiri
    if (loggedInUser.role !== "ADMIN" && loggedInUser.id !== requestedId) {
      throw new HttpException(
        403,
        "Anda tidak diizinkan melihat profil pengguna lain"
      );
    }

    const user = await getUserProfile(requestedId);
    return responseSuccess(res, "Profil berhasil ditemukan", 200, user);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk mengubah atau memperbarui data profil.
 */
export const updateUserProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestedId = res.locals.parsed.params.id;
    const loggedInUser = res.locals.user;

    // Keamanan: Pastikan user hanya mengubah profil miliknya sendiri
    if (loggedInUser.id !== requestedId) {
      throw new HttpException(
        403,
        "Anda hanya dapat memperbarui profil milik sendiri"
      );
    }

    const user = await updateUserProfile(requestedId, res.locals.parsed.body);
    return responseSuccess(res, "Profil Anda berhasil diperbarui", 200, user);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk mengambil seluruh daftar pengguna.
 * Khusus untuk role ADMIN.
 */
export const getListUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getAllUsers();
    return responseSuccess(
      res,
      "Daftar seluruh anggota berhasil diambil",
      200,
      users
    );
  } catch (error) {
    next(error);
  }
};
