import { prisma } from "@/config/prisma";
import { Prisma } from "@prisma";

export const findUserByIdRepo = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      location: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const updateUserRepo = async (
  id: string,
  data: Prisma.UserUpdateInput
) => {
  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      location: true,
      avatar: true,
    },
  });
};

export const findAllUsersRepo = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          borrowings: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    data: users,
    meta: {
      total: users.length,
    },
  };
};
