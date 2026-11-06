export type Category = {
  slug: string;
  name: string;
};

export type ProductFilters = {
  query: string;
  category: string | null;
};
