import multer from "multer";
import path from "path";
import { HttpException } from "@/utils/httpException";
import fs from "fs";

// Pastikan folder uploads tersedia
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Konfigurasi penyimpanan (diskStorage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Format: fieldname-timestamp.ext
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

// Filter tipe file (hanya gambar)
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(
      new HttpException(
        400,
        "Hanya gambar (JPG, PNG, WEBP) yang diperbolehkan"
      ),
      false
    );
  }
};

// Middleware Upload
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // Batas 2MB
  },
  fileFilter: fileFilter,
});
