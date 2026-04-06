export type IBookCreate = {
  title: string;
  slug?: string | undefined;
  author: string;
  description: string;
  isbn: string;
  publishedDate: Date;
  categoryId: string;
  stock: number;
  maxStock?: number | undefined;
  pageCount?: number | undefined;
  year?: number | undefined;
  coverImage: string;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};

export type IBookUpdate = {
  title?: string | undefined;
  slug?: string | undefined;
  author?: string | undefined;
  description?: string | undefined;
  isbn?: string | undefined;
  publishedDate?: Date | undefined;
  categoryId?: string | undefined;
  stock?: number | undefined;
  maxStock?: number | undefined;
  pageCount?: number | undefined;
  year?: number | undefined;
  coverImage?: string | undefined;
  updatedAt?: Date | undefined;
};
