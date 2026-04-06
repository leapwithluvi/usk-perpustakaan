import { prisma } from "@/config/prisma";
import { ICreateBorrowing, IUpdateBorrowing } from "@/types/borrowing.type";
import { BorrowingStatus } from "@prisma";

// CREATE BORROWING
export const createBorrowingRepo = async (data: ICreateBorrowing) => {
  return await prisma.borrowing.create({
    data: {
      userId: data.userId,
      bookId: data.bookId,
      dueDate: data.dueDate,
    },
  });
};

// GET ALL BORROWING (ADMIN) WITH PAGINATION & FILTER
export const getListBorrowingRepo = async (
  page: number = 1,
  limit: number = 10,
  status?: BorrowingStatus
) => {
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) {
    where.status = status;
  }

  const [borrowings, total] = await Promise.all([
    prisma.borrowing.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        book: { select: { title: true, author: true } },
      },
    }),
    prisma.borrowing.count({ where }),
  ]);

  return {
    data: borrowings,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// GET MY BORROWINGS
export const getMyBorrowingsRepo = async (userId: string) => {
  return await prisma.borrowing.findMany({
    where: { userId },
    include: { book: true },
    orderBy: { createdAt: "desc" },
  });
};

// GET BORROWING BY ID
export const getBorrowingByIdRepo = async (id: string) => {
  return await prisma.borrowing.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      book: { include: { category: true } },
    },
  });
};

// UPDATE BORROWING
export const updateBorrowingRepo = async (
  data: IUpdateBorrowing,
  id: string
) => {
  return await prisma.borrowing.update({
    where: { id },
    data: {
      ...(data.borrowDate && { borrowDate: data.borrowDate }),
      ...(data.returnDate && { returnDate: data.returnDate }),
      ...(data.status && { status: data.status }),
      ...(data.pickupCode && { pickupCode: data.pickupCode }),
      ...(data.returnCode && { returnCode: data.returnCode }),
      updatedAt: new Date(),
    },
  });
};

// DELETE BORROWING
export const deleteBorrowingRepo = async (id: string) => {
  return await prisma.borrowing.delete({
    where: { id },
  });
};

// CHECK ACTIVE BORROWING BY USER AND BOOK
export const checkActiveBorrowingRepo = async (userId: string, bookId: string) => {
  return await prisma.borrowing.findFirst({
    where: {
      userId,
      bookId,
      status: {
        in: [BorrowingStatus.PENDING, BorrowingStatus.APPROVED, BorrowingStatus.BORROWED]
      }
    }
  });
};
