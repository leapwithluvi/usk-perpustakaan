import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

/**
 * Middleware untuk memvalidasi input request (body, query, params) menggunakan Zod.
 * Jika validasi gagal, akan mengirimkan respon error 400 dengan detail field yang salah.
 */
export const validateRequest = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Debug Log untuk memeriksa payload yang masuk
      console.log(`[VALIDATOR] ${req.method} ${req.originalUrl}`, {
        body: req.body,
        params: req.params,
        query: req.query,
      });

      // Lakukan parsing data sesuai skema Zod
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Simpan data yang sudah divalidasi ke res.locals untuk digunakan di controller
      res.locals.parsed = parsed;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Log Error Validasi untuk debugging
        console.error(
          `[VALIDATOR ERROR] ${req.method} ${req.originalUrl}:`,
          error.flatten()
        );

        // Format ulang error Zod agar lebih ramah dibaca
        const detail = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: "Validasi data gagal",
          errors: detail,
        });
      }
      console.error(`[SYSTEM ERROR] ${req.method} ${req.originalUrl}:`, error);
      next(error);
    }
  };
};
