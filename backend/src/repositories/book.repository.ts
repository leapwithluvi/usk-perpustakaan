import { IBookCreate, IBookUpdate } from "@/types/book.type";
import { prisma } from "@/config/prisma";
import { GetListBookQuery } from "@/validations/book.validation";
import { slugify } from "@/utils/slugify";

// TAMBAH BUKU BARU
export const createBookRepo = async (data: IBookCreate) => {
  return await prisma.book.create({
    data: {
      title: data.title,
      slug: data.slug || slugify(data.title),
      description: data.description,
      author: data.author,
      isbn: data.isbn,
      publishedDate: data.publishedDate,
      categoryId: data.categoryId,
      stock: data.stock,
      maxStock: data.maxStock || data.stock,
      pageCount: data.pageCount || 0,
      year: data.year || 2024,
      coverImage: data.coverImage,
    },
  });
};

// AMBIL DAFTAR BUKU DENGAN FILTER & PAGINASI
export const getListBookRepo = async (
  query: GetListBookQuery & { categorySlug?: string }
) => {
  const {
    page = 1,
    limit = 10,
    categoryId,
    availability,
    search,
    categorySlug,
  } = query;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    };
  }

  if (availability === "tersedia") {
    where.stock = { gt: 0 };
  } else if (availability === "habis") {
    where.stock = { equals: 0 };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { author: { contains: search, mode: "insensitive" } },
      { isbn: { contains: search, mode: "insensitive" } },
    ];
  }

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.book.count({ where }),
  ]);

  return {
    data: books,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// AMBIL DETAIL BUKU BERDASARKAN ID
export const getBookByIdRepo = async (id: string) => {
  return await prisma.book.findUnique({
    where: { id },
    include: { category: true },
  });
};

// AMBIL DETAIL BUKU BERDASARKAN SLUG
export const getBookBySlugRepo = async (slug: string) => {
  return await prisma.book.findUnique({
    where: { slug },
    include: { category: true },
  });
};

// PERBARUI DATA BUKU
export const updateBookRepo = async (data: IBookUpdate, id: string) => {
  const updateData: any = {
    ...(data.title !== undefined && {
      title: data.title,
      slug: data.slug || slugify(data.title),
    }),
    ...(data.slug !== undefined && { slug: data.slug }),
    ...(data.description !== undefined && { description: data.description }),
    ...(data.author !== undefined && { author: data.author }),
    ...(data.isbn !== undefined && { isbn: data.isbn }),
    ...(data.publishedDate !== undefined && {
      publishedDate: data.publishedDate,
    }),
    ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
    ...(data.stock !== undefined && { stock: data.stock }),
    ...(data.maxStock !== undefined && { maxStock: data.maxStock }),
    ...(data.pageCount !== undefined && { pageCount: data.pageCount }),
    ...(data.year !== undefined && { year: data.year }),
    ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
    updatedAt: new Date(),
  };

  return await prisma.book.update({
    where: { id },
    data: updateData,
  });
};

// HAPUS BUKU
export const deleteBookRepo = async (id: string) => {
  return await prisma.book.delete({
    where: {
      id,
    },
  });
};

// PERBARUI STOK BUKU
export const updateBookStockRepo = async (id: string, quantity: number) => {
  return await prisma.book.update({
    where: { id },
    data: {
      stock: {
        increment: quantity,
      },
    },
  });
};
