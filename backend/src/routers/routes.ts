import { Router } from "express";
import authRouter from "@/routers/auth.routes";
import bookRouter from "@/routers/book.routes";
import categoryRouter from "@/routers/category.routes";
import borrowingRouter from "@/routers/borrowing.routes";
import userRouter from "@/routers/user.routes";
import uploadRouter from "@/routers/upload.routes";
import dashboardRouter from "@/routers/dashboard.routes";

const router = Router();

router.use("/auth", authRouter);
router.use("/books", bookRouter);
router.use("/categories", categoryRouter);
router.use("/borrowing", borrowingRouter);
router.use("/user", userRouter);
router.use("/upload", uploadRouter);
router.use("/dashboard", dashboardRouter);

export default router;
