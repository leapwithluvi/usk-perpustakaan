import { Router } from "express";
import { getDashboardStatsController } from "@/controllers/dashboard.controller";
import { authMiddleware } from "@/middlewares/auth";
import { roleMiddleware } from "@/middlewares/role";

const dashboardRouter = Router();

/**
 * Route untuk mendapatkan statistik dashboard (Hanya ADMIN).
 */
dashboardRouter.get(
  "/stats",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getDashboardStatsController
);

export default dashboardRouter;
