import { NextFunction, Request, Response } from "express";
import { getDashboardStats } from "@/services/dashboard.service";
import { responseSuccess } from "@/utils/response";

/**
 * Controller untuk mendapatkan statistik dashboard admin.
 */
export const getDashboardStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getDashboardStats();
    return responseSuccess(
      res,
      "Statistik dashboard berhasil diambil",
      200,
      stats
    );
  } catch (error) {
    next(error);
  }
};
