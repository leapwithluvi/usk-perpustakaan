import { prisma } from "@/config/prisma";
import { ICreateCategory, IUpdateCategory } from "@/types/category.type";
import { slugify } from "@/utils/slugify";

export const createCategoryRepo = async (data: ICreateCategory) => {
  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug || slugify(data.name),
    },
  });
  return category;
};

export const getListCategoryRepo = async () => {
  const category = await prisma.category.findMany();
  return category;
};

export const getCategoryByIdRepo = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  return category;
};

export const getCategoryBySlugRepo = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
  });
  return category;
};

export const updateCategoryRepo = async (data: IUpdateCategory, id: string) => {
  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(data.name !== undefined && {
        name: data.name,
        slug: data.slug || slugify(data.name),
      }),
      ...(data.slug !== undefined && { slug: data.slug }),
      updatedAt: new Date(),
    },
  });
  return category;
};

export const deleteCategoryRepo = async (id: string) => {
  const category = await prisma.category.delete({
    where: {
      id,
    },
  });
  return category;
};
