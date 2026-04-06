import { Router } from "express";
import { validateRequest } from "@/middlewares/requestValidator";
import {
  createCategorySchema,
  updateCategorySchema,
  getCategoryByIdSchema,
  getCategoryBySlugSchema,
} from "@/validations/category.validation";
import {
  createCategoryController,
  deleteCategoryController,
  getCategoryByIdController,
  getCategoryBySlugController,
  getListCategoryController,
  updateCategoryController,
} from "@/controllers/category.controller";
import { authMiddleware } from "@/middlewares/auth";
import { roleMiddleware } from "@/middlewares/role";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateRequest(createCategorySchema),
  createCategoryController
);
router.get("/", getListCategoryController);
router.get(
  "/:id",
  validateRequest(getCategoryByIdSchema),
  getCategoryByIdController
);
router.get(
  "/slug/:slug",
  validateRequest(getCategoryBySlugSchema),
  getCategoryBySlugController
);
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateRequest(updateCategorySchema),
  updateCategoryController
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateRequest(getCategoryByIdSchema),
  deleteCategoryController
);

export default router;
