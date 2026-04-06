import { Router } from "express";
import { getDashboardStatsController, getPublicStatsController } from "@/controllers/dashboard.controller";
import { authMiddleware } from "@/middlewares/auth";
import { roleMiddleware } from "@/middlewares/role";

const dashboardRouter = Router();

/**
 * Route untuk mendapatkan statistik publik landing page.
 */
dashboardRouter.get("/public-stats", getPublicStatsController);

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
