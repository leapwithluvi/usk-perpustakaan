import { PrismaClient, Role, Status } from "../../generated/prisma";
import bcrypt from "bcryptjs";

export const seedUsers = async (prisma: PrismaClient) => {
  console.log("Seeding users...");

  const hashedPasswordAdmin = await bcrypt.hash("Admin123!", 12);
  const hashedPasswordUser = await bcrypt.hash("User123!", 12);

  // Seed Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPasswordAdmin,
      name: "Admin Perpustakaan",
      role: Role.ADMIN,
      status: Status.ACTIVE,
    },
  });
  console.log(`Admin ready: ${admin.email}`);

  // Seed Regular User
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      password: hashedPasswordUser,
      name: "Budi Pustaka",
      phone: "08123456789",
      location: "Banda Aceh",
      role: Role.USER,
      status: Status.ACTIVE,
    },
  });
  console.log(`Regular user ready: ${user.email}`);
};
