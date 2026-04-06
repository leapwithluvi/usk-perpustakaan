import { Router } from "express";
import { authMiddleware } from "@/middlewares/auth";
import { validateRequest } from "@/middlewares/requestValidator";
import {
  loginSchema,
  refreshSchema,
  registerSchema,
} from "@/validations/auth.validation";
import {
  loginController,
  logoutController,
  logoutAllController,
  meController,
  refreshController,
  registerController,
} from "@/controllers/auth.controller";

const router = Router();

// Public routes
router.post("/register", validateRequest(registerSchema), registerController);
router.post("/login", validateRequest(loginSchema), loginController);
router.post("/refresh", validateRequest(refreshSchema), refreshController);

// Protected routes
router.post("/logout", authMiddleware, logoutController);
router.post("/logout-all", authMiddleware, logoutAllController);
router.get("/me", authMiddleware, meController);

export default router;
