import { z } from "zod";
import { BorrowingStatus } from "@prisma";

/**
 * Skema untuk pengajuan peminjaman baru.
 * userId tidak lagi di body karena diambil dari token.
 */
export const createBorrowingSchema = z.object({
  body: z.object({
    bookId: z.string().uuid("ID Buku tidak valid"),
    dueDate: z
      .string()
      .datetime()
      .transform((val) => new Date(val)),
  }),
});

/**
 * Skema untuk memperbarui status peminjaman oleh admin.
 */
export const updateBorrowingSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID Peminjaman tidak valid"),
  }),
  body: z.object({
    status: z.nativeEnum(BorrowingStatus).optional(),
    returnDate: z
      .string()
      .datetime()
      .transform((val) => new Date(val))
      .optional(),
    code: z.string().optional(),
  }),
});

/**
 * Skema untuk query list peminjaman admin.
 */
export const getListBorrowingQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v) : 1)),
    limit: z
      .string()
      .optional()
      .transform((v) => (v ? parseInt(v) : 10)),
    status: z.nativeEnum(BorrowingStatus).optional(),
  }),
});

export type CreateBorrowingInput = z.infer<
  typeof createBorrowingSchema
>["body"];
export type UpdateBorrowingInput = z.infer<
  typeof updateBorrowingSchema
>["body"];
