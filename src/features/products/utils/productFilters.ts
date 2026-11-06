import type { ProductFilters } from '@/features/catalog';
import type { CatalogProduct, ProductsPage } from '../types';

export function needsCatalog({ query, category }: ProductFilters): boolean {
  return Boolean(query && category);
}

export function filterCatalog(
  catalog: CatalogProduct[],
  { query, category }: ProductFilters,
): CatalogProduct[] {
  const search = query.toLowerCase();

  return catalog.filter(
    product =>
      (!category || product.category === category) &&
      (!search ||
        product.title.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search)),
  );
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
