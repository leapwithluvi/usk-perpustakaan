import { Router } from "express";
import { upload } from "@/middlewares/upload";
import { responseSuccess } from "@/utils/response";
import { authMiddleware } from "@/middlewares/auth";
import { HttpException } from "@/utils/httpException";

const uploadRouter = Router();

/**
 * Rute tunggal untuk mengunggah satu file gambar.
 * Mengembalikan URL file yang bisa disimpan ke database User atau Book.
 */
uploadRouter.post(
  "/single",
  authMiddleware,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      throw new HttpException(400, "File gambar wajib diunggah");
    }

    // Buat URL lengkap atau path relatif
    const fileUrl = `/uploads/${req.file.filename}`;

    return responseSuccess(res, "File berhasil diunggah", 201, {
      url: fileUrl,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });
  }
);

export default uploadRouter;
