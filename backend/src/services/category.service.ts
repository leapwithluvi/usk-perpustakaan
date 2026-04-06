import {
  createCategoryRepo,
  deleteCategoryRepo,
  getCategoryByIdRepo,
  getCategoryBySlugRepo,
  getListCategoryRepo,
  updateCategoryRepo,
} from "@/repositories/category.repository";
import { HttpException } from "@/utils/httpException";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/validations/category.validation";

/**
 * Service untuk mengambil seluruh daftar kategori buku.
 */
export const getListCategory = async () => {
  return await getListCategoryRepo();
};

/**
 * Service untuk mendapatkan detail kategori tertentu berdasarkan ID.
 */
export const getCategoryById = async (id: string) => {
  if (!id) {
    throw new HttpException(400, "ID kategori diperlukan");
  }

  const category = await getCategoryByIdRepo(id);
  if (!category) {
    throw new HttpException(404, "Kategori tidak ditemukan");
  }

  return category;
};

/**
 * Service untuk mendapatkan detail kategori tertentu berdasarkan Slug.
 */
export const getCategoryBySlug = async (slug: string) => {
  if (!slug) {
    throw new HttpException(400, "Slug kategori diperlukan");
  }

  const category = await getCategoryBySlugRepo(slug);
  if (!category) {
    throw new HttpException(404, "Kategori tidak ditemukan");
  }

  return category;
};

/**
 * Service untuk menambahkan kategori baru (Hanya ADMIN).
 */
export const createCategory = async (data: CreateCategoryInput) => {
  return await createCategoryRepo(data);
};

/**
 * Service untuk mengubah nama kategori (Hanya ADMIN).
 */
export const updateCategory = async (data: UpdateCategoryInput, id: string) => {
  const existing = await getCategoryById(id);
  if (!existing) {
    throw new HttpException(404, "Kategori yang ingin diubah tidak ditemukan");
  }

  return await updateCategoryRepo(data, id);
};

/**
 * Service untuk menghapus kategori buku (Hanya ADMIN).
 */
export const deleteCategory = async (id: string) => {
  const existing = await getCategoryById(id);
  if (!existing) {
    throw new HttpException(404, "Kategori yang ingin dihapus tidak ditemukan");
  }

  return await deleteCategoryRepo(id);
};
