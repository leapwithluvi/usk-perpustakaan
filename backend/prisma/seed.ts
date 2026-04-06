import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaClient } from "../generated/prisma";
import { seedUsers } from "./seeders/user.seeder";
import { seedCategories } from "./seeders/category.seeder";
import { seedBooks } from "./seeders/book.seeder";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting master seeding...");

  await seedCategories(prisma);
  await seedBooks(prisma);
  await seedUsers(prisma);

  console.log("Master seeding finished successfully.");
}

main()
  .catch((e) => {
    console.error("Seeding failed:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
