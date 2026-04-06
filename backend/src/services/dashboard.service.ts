import { getDashboardStatsRepo } from "@/repositories/dashboard.repository";

/**
 * Service untuk mendapatkan statistik dashboard.
 */
export const getDashboardStats = async () => {
  return await getDashboardStatsRepo();
};
