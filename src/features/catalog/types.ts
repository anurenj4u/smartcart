export type Category = {
  slug: string;
  name: string;
};

export type ProductSort = 'default' | 'price-asc' | 'price-desc' | 'rating-desc';

export type ProductRefinements = {
  sort: ProductSort;
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
};

export type ProductFilters = ProductRefinements & {
  query: string;
  category: string | null;
};
