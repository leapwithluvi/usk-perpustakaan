import { NextFunction, Request, Response } from "express";
import {
  createBorrowing,
  deleteBorrowing,
  getBorrowingById,
  getListBorrowing,
  updateBorrowing,
  getMyBorrowings,
} from "@/services/borrowing.service";
import { responseSuccess } from "@/utils/response";

/**
 * Controller untuk pengajuan peminjaman.
 * Keamanan: Mengambil userId langsung dari token, data dari body hanya bookId & dueDate.
 */
export const createBorrowingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Ambil ID dari user yang sedang login agar tidak bisa dimanipulasi
    const payload = {
      ...res.locals.parsed.body,
      userId: res.locals.user.id,
    };
    const borrowing = await createBorrowing(payload);
    return responseSuccess(
      res,
      "Pengajuan peminjaman berhasil dikirim",
      201,
      borrowing
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk melihat seluruh peminjaman (Hanya ADMIN).
 */
export const getListBorrowingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, limit, status } = res.locals.parsed.query;
    const result = await getListBorrowing(page, limit, status);
    return responseSuccess(
      res,
      "Daftar seluruh peminjaman berhasil diambil",
      200,
      result
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk melihat detail satu peminjaman (Admin & Pemilik).
 */
export const getBorrowingByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const borrowing = await getBorrowingById(res.locals.parsed.params.id);
    return responseSuccess(
      res,
      "Detail data peminjaman ditemukan",
      200,
      borrowing
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk riwayat pribadi.
 */
export const getMyBorrowingsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const borrowing = await getMyBorrowings(res.locals.user.id);
    return responseSuccess(
      res,
      "Riwayat peminjaman Anda berhasil dikirim",
      200,
      borrowing
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk memperbarui status peminjaman (Hanya ADMIN).
 */
export const updateBorrowingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const borrowing = await updateBorrowing(
      res.locals.parsed.body,
      res.locals.parsed.params.id
    );
    return responseSuccess(
      res,
      "Status peminjaman berhasil diperbarui",
      200,
      borrowing
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk menghapus catatan peminjaman (Hanya ADMIN).
 */
export const deleteBorrowingController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const borrowing = await deleteBorrowing(res.locals.parsed.params.id);
    return responseSuccess(
      res,
      "Catatan peminjaman berhasil dihapus",
      200,
      borrowing
    );
  } catch (error) {
    next(error);
  }
};
