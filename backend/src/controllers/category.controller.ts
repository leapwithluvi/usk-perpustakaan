import { NextFunction, Request, Response } from "express";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getCategoryBySlug,
  getListCategory,
  updateCategory,
} from "@/services/category.service";
import { responseSuccess } from "@/utils/response";

/**
 * Controller untuk mengambil seluruh daftar kategori.
 */
export const getListCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await getListCategory();
    return responseSuccess(res, "Daftar kategori dikirim", 200, category);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk mengambil satu kategori berdasarkan ID.
 */
export const getCategoryByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await getCategoryById(res.locals.parsed.params.id);
    return responseSuccess(res, "Informasi kategori ditemukan", 200, category);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk mengambil satu kategori berdasarkan Slug.
 */
export const getCategoryBySlugController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await getCategoryBySlug(res.locals.parsed.params.slug);
    return responseSuccess(res, "Informasi kategori ditemukan", 200, category);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk membuat kategori baru.
 */
export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await createCategory(res.locals.parsed.body);
    return responseSuccess(res, "Kategori baru berhasil dibuat", 201, category);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk memperbarui informasi kategori.
 */
export const updateCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await updateCategory(
      res.locals.parsed.body,
      res.locals.parsed.params.id
    );
    return responseSuccess(res, "Kategori berhasil diperbarui", 200, category);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller untuk menghapus kategori.
 */
export const deleteCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await deleteCategory(res.locals.parsed.params.id);
    return responseSuccess(res, "Kategori berhasil dihapus", 200, category);
  } catch (error) {
    next(error);
  }
};
