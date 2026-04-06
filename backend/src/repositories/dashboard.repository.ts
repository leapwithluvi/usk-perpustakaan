import { prisma } from "@/config/prisma";

/**
 * Mendapatkan statistik untuk dashboard admin.
 */
export const getDashboardStatsRepo = async () => {
  const [totalBooks, totalUsers, totalBorrowed, pendingBorrowings] =
    await Promise.all([
      prisma.book.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.borrowing.count({ where: { status: "BORROWED" } }),
      prisma.borrowing.count({ where: { status: "PENDING" } }),
    ]);

  return {
    totalBooks,
    totalUsers,
    totalBorrowed,
    pendingBorrowings,
  };
};

/**
 * Mendapatkan statistik publik untuk landing page.
 */
export const getPublicStatsRepo = async () => {
  const [totalBooks, activeReaders, totalGenres] = await Promise.all([
    prisma.book.count(),
    prisma.user.count({ 
      where: { 
        role: "USER", 
        lastLoginAt: { not: null } 
      } 
    }),
    prisma.category.count(),
  ]);

  return {
    totalBooks,
    activeReaders,
    totalGenres,
  };
};
