import z from "zod";

export const createBookSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Judul wajib diisi"),
    slug: z.string().min(1, "Slug wajib diisi").optional(),
    description: z.string().min(1, "Deskripsi wajib diisi"),
    author: z.string().min(1, "Penulis wajib diisi"),
    isbn: z.string().min(1, "ISBN wajib diisi"),
    publishedDate: z.coerce.date(),
    categoryId: z.string().min(1, "Kategori wajib diisi"),
    stock: z.number().min(0, "Stok tidak boleh negatif"),
    maxStock: z.number().min(0).optional(),
    pageCount: z.number().min(0).optional(),
    year: z.number().optional(),
    coverImage: z.string().min(1, "URL Gambar atau Path File wajib diisi"),
  }),
});

export const updateBookSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID buku tidak valid"),
  }),
  body: z.object({
    title: z.string().min(1, "Judul wajib diisi").optional(),
    slug: z.string().min(1, "Slug wajib diisi").optional(),
    description: z.string().min(1, "Deskripsi wajib diisi").optional(),
    author: z.string().min(1, "Penulis wajib diisi").optional(),
    isbn: z.string().min(1, "ISBN wajib diisi").optional(),
    publishedDate: z.coerce.date().optional(),
    categoryId: z.string().min(1, "Kategori wajib diisi").optional(),
    stock: z.number().min(0, "Jumlah Stok wajib diisi").optional(),
    maxStock: z.number().min(0).optional(),
    pageCount: z.number().min(0).optional(),
    year: z.number().optional(),
    coverImage: z
      .string()
      .min(1, "URL Gambar atau Path File wajib diisi")
      .optional(),
  }),
});

export const getListBookQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v) : 1)),
    limit: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v) : 10))
      .refine((v) => v >= 1 && v <= 50, "Limit harus antara 1 dan 50"),
    categoryId: z.string().optional(),
    categorySlug: z.string().optional(),
    availability: z.enum(["tersedia", "habis"]).optional(),
    search: z.string().optional(),
  }),
});

export const getBookByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID buku tidak valid"),
  }),
});

export const getBookBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug buku wajib diisi"),
  }),
});

export type CreateBookInput = z.infer<typeof createBookSchema>["body"];
export type UpdateBookInput = z.infer<typeof updateBookSchema>["body"];
export type GetListBookQuery = z.infer<
  typeof getListBookQuerySchema
>["query"] & { categorySlug?: string };
export type GetBookBySlugParams = z.infer<typeof getBookBySlugSchema>["params"];
