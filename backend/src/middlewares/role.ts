import { Role } from "@prisma";
import { NextFunction, Request, Response } from "express";

/**
 * Middleware untuk membatasi akses berdasarkan peran (Role) pengguna.
 * WAJIB ditaruh setelah authMiddleware karena butuh data res.locals.user.
 *
 * @param allowedRoles Daftar peran yang diizinkan (contoh: ['ADMIN', 'USER'])
 */
export const roleMiddleware = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    // Pastikan data user ada di session
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak: Data pengguna tidak ditemukan dalam sesi",
      });
    }

    // Cek apakah peran user termasuk dalam daftar yang diizinkan
    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: `Terlarang: Aksi ini memerlukan salah satu dari peran berikut: ${allowedRoles.join(", ")}`,
      });
    }

    next();
  };
};
