import { getDashboardStatsRepo, getPublicStatsRepo } from "@/repositories/dashboard.repository";

/**
 * Service untuk mendapatkan statistik dashboard.
 */
export const getDashboardStats = async () => {
  return await getDashboardStatsRepo();
};

/**
 * Service untuk mendapatkan statistik publik.
 */
export const getPublicStats = async () => {
  return await getPublicStatsRepo();
};
