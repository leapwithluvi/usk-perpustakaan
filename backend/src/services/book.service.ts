import {
  getListBookRepo,
  getBookByIdRepo,
  getBookBySlugRepo,
  createBookRepo,
  updateBookRepo,
  deleteBookRepo,
} from "@/repositories/book.repository";
import { HttpException } from "@/utils/httpException";
import {
  CreateBookInput,
  UpdateBookInput,
  GetListBookQuery,
} from "@/validations/book.validation";

/**
 * Service untuk mendapatkan daftar seluruh buku dengan filter/pagination.
 */
export const getListBook = async (query: GetListBookQuery) => {
  return await getListBookRepo(query);
};

/**
 * Service untuk mendapatkan detail satu buku berdasarkan ID.
 */
export const getBookById = async (id: string) => {
  if (!id) {
    throw new HttpException(400, "ID buku diperlukan");
  }

  const book = await getBookByIdRepo(id);
  if (!book) {
    throw new HttpException(404, "Buku tidak ditemukan");
  }

  return book;
};

/**
 * Service untuk mendapatkan detail satu buku berdasarkan Slug.
 */
export const getBookBySlug = async (slug: string) => {
  if (!slug) {
    throw new HttpException(400, "Slug buku diperlukan");
  }

  const book = await getBookBySlugRepo(slug);
  if (!book) {
    throw new HttpException(404, "Buku tidak ditemukan");
  }

  return book;
};

/**
 * Service untuk menambah koleksi buku baru (Hanya ADMIN).
 */
export const createBook = async (data: CreateBookInput) => {
  return await createBookRepo(data);
};

/**
 * Service untuk memperbarui data buku yang sudah ada (Hanya ADMIN).
 */
export const updateBook = async (data: UpdateBookInput, id: string) => {
  const existing = await getBookById(id);
  if (!existing) {
    throw new HttpException(404, "Buku yang ingin diperbarui tidak ditemukan");
  }

  return await updateBookRepo(data, id);
};

/**
 * Service untuk menghapus buku dari sistem (Hanya ADMIN).
 */
export const deleteBook = async (id: string) => {
  const existing = await getBookById(id);
  if (!existing) {
    throw new HttpException(404, "Buku yang ingin dihapus tidak ditemukan");
  }

  return await deleteBookRepo(id);
};
