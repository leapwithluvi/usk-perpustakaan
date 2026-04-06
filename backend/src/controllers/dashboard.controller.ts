import { NextFunction, Request, Response } from "express";
import { getDashboardStats, getPublicStats } from "@/services/dashboard.service";
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

/**
 * Controller untuk mendapatkan statistik publik landing page.
 */
export const getPublicStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const stats = await getPublicStats();
    return responseSuccess(
      res,
      "Statistik publik berhasil diambil",
      200,
      stats
    );
  } catch (error) {
    next(error);
  }
};
