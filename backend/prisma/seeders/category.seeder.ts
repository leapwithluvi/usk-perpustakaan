import { PrismaClient } from "../../generated/prisma";
import { slugify } from "../../src/utils/slugify";

export const seedCategories = async (prisma: PrismaClient) => {
  console.log("Seeding categories...");

  const categories = [
    { name: "Fiksi" },
    { name: "Misteri & Thriller" },
    { name: "Pengembangan Diri" },
    { name: "Teknologi" },
    { name: "Komik & Novel Grafis" },
    { name: "Sains & Pendidikan" },
    { name: "Bisnis & Ekonomi" },
    { name: "Agama & Spiritual" },
    { name: "Sejarah & Budaya" },
    { name: "Seni & Fotografi" },
    { name: "Kesehatan & Olahraga" },
    { name: "Masak & Kuliner" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {
        slug: slugify(cat.name),
      },
      create: {
        ...cat,
        slug: slugify(cat.name),
      },
    });
  }

  // Actually, name should be unique for categories in a library system.
  // But let's stick to the current schema and just use upsert with a logic.

  console.log("Categories seeded successfully.");
};
