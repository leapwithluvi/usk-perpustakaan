import { validateRequest } from "@/middlewares/requestValidator";
import {
  createBookSchema,
  updateBookSchema,
  getListBookQuerySchema,
  getBookByIdSchema,
  getBookBySlugSchema,
} from "@/validations/book.validation";
import { Router } from "express";
import {
  createBookController,
  deleteBookController,
  getBookByIdController,
  getBookBySlugController,
  getListBookController,
  updateBookController,
} from "@/controllers/book.controller";
import { authMiddleware } from "@/middlewares/auth";
import { roleMiddleware } from "@/middlewares/role";

const router = Router();

// Akses publik ke daftar buku dan detail buku
router.get("/", validateRequest(getListBookQuerySchema), getListBookController);
router.get("/:id", validateRequest(getBookByIdSchema), getBookByIdController);
router.get(
  "/slug/:slug",
  validateRequest(getBookBySlugSchema),
  getBookBySlugController
);

// Admin only routes
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateRequest(createBookSchema),
  createBookController
);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateRequest(updateBookSchema),
  updateBookController
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateRequest(getBookByIdSchema),
  deleteBookController
);

export default router;
