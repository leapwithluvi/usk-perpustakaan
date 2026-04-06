import {
  createBorrowingController,
  deleteBorrowingController,
  getBorrowingByIdController,
  getListBorrowingController,
  updateBorrowingController,
  getMyBorrowingsController,
} from "@/controllers/borrowing.controller";
import { validateRequest } from "@/middlewares/requestValidator";
import {
  createBorrowingSchema,
  updateBorrowingSchema,
  getListBorrowingQuerySchema,
} from "@/validations/borrowing.validation";
import { Router } from "express";
import { authMiddleware } from "@/middlewares/auth";
import { roleMiddleware } from "@/middlewares/role";

const router = Router();

router.use(authMiddleware);

// User & Admin can create borrowing
router.post(
  "/",
  roleMiddleware(["USER"]),
  validateRequest(createBorrowingSchema),
  createBorrowingController
);

// User can only see their own borrowings
router.get("/my", getMyBorrowingsController);

// Admin can see all borrowings
router.get(
  "/",
  roleMiddleware(["ADMIN"]),
  validateRequest(getListBorrowingQuerySchema),
  getListBorrowingController
);

// Admin can see specific borrowing
router.get("/:id", roleMiddleware(["ADMIN"]), getBorrowingByIdController);

// Admin can update/delete (Approve/Pickup/Return)
router.patch(
  "/:id",
  roleMiddleware(["ADMIN"]),
  validateRequest(updateBorrowingSchema),
  updateBorrowingController
);
router.delete("/:id", roleMiddleware(["ADMIN"]), deleteBorrowingController);

export default router;
