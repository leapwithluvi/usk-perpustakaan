import { z } from "zod";

export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid("ID Pengguna tidak valid"),
  }),
  body: z.object({
    name: z.string().min(3, "Nama minimal 3 karakter").optional(),
    phone: z.string().min(10, "Nomor HP minimal 10 digit").optional(),
    location: z.string().optional(),
    avatar: z.string().optional(),
    email: z.string().email("Email tidak valid").optional(),
  }),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>["body"];
