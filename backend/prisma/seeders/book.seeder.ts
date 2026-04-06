import { PrismaClient } from "../../generated/prisma";
import { slugify } from "../../src/utils/slugify";

export const seedBooks = async (prisma: PrismaClient) => {
  console.log("Seeding books...");

  const books = [
    {
      title: "Laut Bercerita",
      description: "Sebuah novel yang mengangkat tema penghilangan paksa aktivis pada masa Orde Baru.",
      author: "Leila S. Chudori",
      isbn: "978-602-424-693-8",
      categoryName: "Fiksi",
      coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "The Silent Patient",
      description: "A shocking psychological thriller about a woman's act of violence against her husband.",
      author: "Alex Michaelides",
      isbn: "978-125-030-169-7",
      categoryName: "Misteri & Thriller",
      coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Atomic Habits",
      description: "An easy and proven way to build good habits and break bad ones.",
      author: "James Clear",
      isbn: "978-073-521-129-2",
      categoryName: "Pengembangan Diri",
      coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Clean Code",
      description: "A handbook of agile software craftsmanship.",
      author: "Robert C. Martin",
      isbn: "978-013-235-088-4",
      categoryName: "Teknologi",
      coverImage: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "One Piece Vol. 1",
      description: "The journey of Monkey D. Luffy to become the Pirate King.",
      author: "Eiichiro Oda",
      isbn: "978-156-931-901-7",
      categoryName: "Komik & Novel Grafis",
      coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Sapiens",
      description: "A brief history of humankind.",
      author: "Yuval Noah Harari",
      isbn: "978-006-231-609-7",
      categoryName: "Sains & Pendidikan",
      coverImage: "https://images.unsplash.com/photo-1491845339675-d22fc1ef2c42?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "The Intelligent Investor",
      description: "The classic text on value investing.",
      author: "Benjamin Graham",
      isbn: "978-006-055-566-5",
      categoryName: "Bisnis & Ekonomi",
      coverImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "The Alchemist",
      description: "A fable about following your dream.",
      author: "Paulo Coelho",
      isbn: "978-006-231-500-7",
      categoryName: "Agama & Spiritual",
      coverImage: "https://images.unsplash.com/photo-1543005128-d39eef402383?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Guns, Germs, and Steel",
      description: "The fates of human societies.",
      author: "Jared Diamond",
      isbn: "978-039-331-755-8",
      categoryName: "Sejarah & Budaya",
      coverImage: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Ways of Seeing",
      description: "A book on art criticism by John Berger.",
      author: "John Berger",
      isbn: "978-014-013-515-2",
      categoryName: "Seni & Fotografi",
      coverImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "The Fitness Mindset",
      description: "Eat for energy, train for tension, manage your mindset, reap the results.",
      author: "Brian Keane",
      isbn: "978-178-133-252-8",
      categoryName: "Kesehatan & Olahraga",
      coverImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Salt, Fat, Acid, Heat",
      description: "Mastering the elements of good cooking.",
      author: "Samin Nosrat",
      isbn: "978-147-675-383-6",
      categoryName: "Masak & Kuliner",
      coverImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800",
    },
  ];

  for (const b of books) {
    const category = await prisma.category.findUnique({
      where: { name: b.categoryName },
    });

    if (!category) {
      console.warn(`Category ${b.categoryName} not found, skipping book ${b.title}`);
      continue;
    }

    await prisma.book.upsert({
      where: { isbn: b.isbn },
      update: {
        title: b.title,
        slug: slugify(b.title),
        description: b.description,
        author: b.author,
        categoryId: category.id,
        stock: 10,
        maxStock: 10,
        pageCount: 300,
        year: 2024,
        coverImage: b.coverImage,
        publishedDate: new Date(),
      },
      create: {
        title: b.title,
        slug: slugify(b.title),
        description: b.description,
        author: b.author,
        isbn: b.isbn,
        categoryId: category.id,
        stock: 10,
        maxStock: 10,
        pageCount: 300,
        year: 2024,
        coverImage: b.coverImage,
        publishedDate: new Date(),
      },
    });
    console.log(`Book ready: ${b.title} [${b.categoryName}]`);
  }

  console.log("Books seeded successfully.");
};
