import z from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, "Nama kategori wajib diisi"),
    slug: z.string().min(1, "Slug kategori wajib diisi").optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid("ID kategori tidak valid"),
  }),
  body: z.object({
    name: z.string().min(1, "Nama kategori wajib diisi").optional(),
    slug: z.string().min(1, "Slug kategori wajib diisi").optional(),
  }),
});

export const getCategoryByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID kategori tidak valid"),
  }),
});

export const getCategoryBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, "Slug kategori wajib diisi"),
  }),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>["body"];
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>["body"];
export type GetCategoryBySlugParams = z.infer<
  typeof getCategoryBySlugSchema
>["params"];
