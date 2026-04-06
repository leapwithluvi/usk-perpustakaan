import { PrismaClient } from "../../generated/prisma";
import { slugify } from "../../src/utils/slugify";

export const seedBooks = async (prisma: PrismaClient) => {
  const category = await prisma.category.findFirst({
    where: { name: "Komik & Novel Grafis" },
  });

  const bookTitle = "Lord of the Mysteries";
  const book = await prisma.book.create({
    data: {
      title: bookTitle,
      slug: slugify(bookTitle),
      description:
        "Steampunk meets Lovecraftian horror in a Victorian era setting.",
      author: "Cuttlefish That Loves Diving",
      isbn: "978-013-445-641-5",
      publishedDate: new Date("2026-04-05"),
      categoryId: category!.id,
      stock: 50,
      maxStock: 100,
      pageCount: 1432,
      year: 2026,
      coverImage: "https://unsplash.com",
    },
  });
  console.log(`Book ready: ${book.title}`);
};
