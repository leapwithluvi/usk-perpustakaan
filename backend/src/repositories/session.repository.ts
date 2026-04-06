import { prisma } from "@/config/prisma";
import { CreateSessionData, UpdateSessionData } from "@/types/session.type";

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  status: true,
};

export const createSession = async (data: CreateSessionData) => {
  return await prisma.session.create({
    data,
    include: { user: { select: userSelect } },
  });
};

export const findSessionById = async (sessionId: string) => {
  return await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: { select: userSelect } },
  });
};

export const findSessionByRefreshToken = async (refreshToken: string) => {
  return await prisma.session.findUnique({
    where: { refreshToken },
    include: { user: { select: userSelect } },
  });
};

export const updateSession = async (
  sessionId: string,
  data: UpdateSessionData
) => {
  return await prisma.session.update({
    where: { id: sessionId },
    data,
    include: { user: { select: userSelect } },
  });
};

export const deleteSession = async (sessionId: string) => {
  return await prisma.session.delete({
    where: { id: sessionId },
  });
};

export const deleteAllUserSessions = async (userId: string) => {
  return await prisma.session.deleteMany({
    where: { userId },
  });
};

export const deleteExpiredSessions = async () => {
  return await prisma.session.deleteMany({
    where: { expiresAt: { lt: new Date() } },
  });
};
