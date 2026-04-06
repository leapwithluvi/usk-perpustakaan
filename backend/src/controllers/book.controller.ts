import { NextFunction, Request, Response } from "express";
import {
  createBook,
  deleteBook,
  getBookById,
  getBookBySlug,
  getListBook,
  updateBook,
} from "@/services/book.service";
import { responseSuccess } from "@/utils/response";

/**
 * Kontroler untuk mengambil daftar buku.
 * Mendukung filter kategori, pencarian, ketersediaan, dan paginasi.
 */
export const getListBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const books = await getListBook(res.locals.parsed.query);
    return responseSuccess(res, "Daftar buku berhasil diambil", 200, books);
  } catch (error) {
    next(error);
  }
};

/**
 * Kontroler untuk mengambil detail buku berdasarkan ID.
 */
export const getBookByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await getBookById(res.locals.parsed.params.id);
    return responseSuccess(res, "Detail buku berhasil dikirim", 200, book);
  } catch (error) {
    next(error);
  }
};

/**
 * Kontroler untuk mengambil detail buku berdasarkan Slug.
 */
export const getBookBySlugController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await getBookBySlug(res.locals.parsed.params.slug);
    return responseSuccess(res, "Detail buku berhasil dikirim", 200, book);
  } catch (error) {
    next(error);
  }
};

/**
 * Kontroler untuk pembuatan data buku baru (Hanya Admin).
 */
export const createBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await createBook(res.locals.parsed.body);
    return responseSuccess(res, "Buku baru berhasil ditambahkan", 201, book);
  } catch (error) {
    next(error);
  }
};

/**
 * Kontroler untuk memperbarui data buku (Hanya Admin).
 */
export const updateBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await updateBook(
      res.locals.parsed.body,
      res.locals.parsed.params.id
    );
    return responseSuccess(res, "Data buku berhasil diperbarui", 200, book);
  } catch (error) {
    next(error);
  }
};

/**
 * Kontroler untuk menghapus data buku dari sistem (Hanya Admin).
 */
export const deleteBookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const book = await deleteBook(res.locals.parsed.params.id);
    return responseSuccess(res, "Buku berhasil dihapus dari sistem", 200, book);
  } catch (error) {
    next(error);
  }
};
