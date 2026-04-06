export type ICreateCategory = {
  name: string;
  slug?: string | undefined;
};

export type IUpdateCategory = {
  name?: string | undefined;
  slug?: string | undefined;
};
