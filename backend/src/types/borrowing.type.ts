import { BorrowingStatus } from "@prisma";

export type ICreateBorrowing = {
  userId: string;
  bookId: string;
  dueDate: Date;
};

export type IUpdateBorrowing = {
  borrowDate?: Date;
  returnDate?: Date;
  status?: BorrowingStatus;
  pickupCode?: string;
  returnCode?: string;
  code?: string;
};
