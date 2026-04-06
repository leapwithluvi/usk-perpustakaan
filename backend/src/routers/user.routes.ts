import { Router } from "express";
import {
  getListUserController,
  getUserProfileController,
  updateUserProfileController,
} from "@/controllers/user.controller";
import { validateRequest } from "@/middlewares/requestValidator";
import { updateUserSchema } from "@/validations/user.validation";
import { authMiddleware } from "@/middlewares/auth";
import { roleMiddleware } from "@/middlewares/role";

const userRouter = Router();

// Semua rute user membutuhkan login
userRouter.use(authMiddleware);

userRouter.get("/", roleMiddleware(["ADMIN"]), getListUserController);
userRouter.get("/:id", getUserProfileController);
userRouter.put(
  "/:id",
  validateRequest(updateUserSchema),
  updateUserProfileController
);

export default userRouter;
