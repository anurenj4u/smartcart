import type { ProductFilters, ProductSort } from '@/features/catalog';
import { toCents } from '@/shared/utils/money';
import { getProductPricing } from '@/shared/utils/pricing';
import type { CatalogProduct, ProductsPage } from '../types';

const finalCents = (product: CatalogProduct) =>
  getProductPricing(product).finalCents;

const displayedRating = (rating: number) => Math.round(rating * 10) / 10;

export function needsCatalog({
  query,
  category,
  sort,
  minPrice,
  maxPrice,
  minRating,
}: ProductFilters): boolean {
  return (
    Boolean(query && category) ||
    sort === 'price-asc' ||
    sort === 'price-desc' ||
    minPrice !== null ||
    maxPrice !== null ||
    minRating !== null
  );
}

export function getServerSort(sort: ProductSort) {
  return sort === 'rating-desc'
    ? { sortBy: 'rating', order: 'desc' }
    : { sortBy: undefined, order: undefined };
}

function sortCatalog(products: CatalogProduct[], sort: ProductSort) {
  switch (sort) {
    case 'price-asc':
      return [...products].sort((a, b) => finalCents(a) - finalCents(b));
    case 'price-desc':
      return [...products].sort((a, b) => finalCents(b) - finalCents(a));
    case 'rating-desc':
      return [...products].sort((a, b) => b.rating - a.rating);
    default:
      return products;
  }
}

export function filterCatalog(
  catalog: CatalogProduct[],
  { query, category, sort, minPrice, maxPrice, minRating }: ProductFilters,
): CatalogProduct[] {
  const search = query.toLowerCase();
  const minCents = minPrice === null ? null : toCents(minPrice);
  const maxCents = maxPrice === null ? null : toCents(maxPrice);

  const matches = catalog.filter(product => {
    const price = finalCents(product);

    return (
      (!category || product.category === category) &&
      (!search ||
        product.title.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search)) &&
      (minCents === null || price >= minCents) &&
      (maxCents === null || price <= maxCents) &&
      (minRating === null || displayedRating(product.rating) >= minRating)
    );
  });

  return sortCatalog(matches, sort);
}

export function paginate(
  products: CatalogProduct[],
  skip: number,
  limit: number,
): ProductsPage {
  return {
    products: products.slice(skip, skip + limit),
    total: products.length,
    skip,
    limit,
  };
}
