import { Request, Response, NextFunction } from "express";
import { HttpException } from "@/utils/httpException";

/**
 * Global Error Handler untuk menangani semua exception di aplikasi.
 * Memberikan format response yang konsisten jika terjadi error.
 */
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // Log error secara internal untuk debugging admin
  console.error(`[ERROR] ${new Date().toISOString()}:`, err);

  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }

  // Default error jika terjadi kegagalan sistem yang tak terduga
  return res.status(500).json({
    success: false,
    message: "Terjadi kesalahan internal pada server.",
    stack:
      process.env.NODE_ENV === "development" ? (err as Error).stack : undefined,
  });
};
