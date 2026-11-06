import type { ProductFilters } from '@/features/catalog';
import { request } from '@/shared/api';
import type {
  CatalogProduct,
  Product,
  ProductsPage,
  SimilarCandidate,
} from '../types';
import { getServerSort } from '../utils/productFilters';

const SUMMARY_FIELDS = 'title,price,discountPercentage,rating,stock,thumbnail';
const CATALOG_FIELDS = `${SUMMARY_FIELDS},description,category`;
const SIMILAR_FIELDS = `${SUMMARY_FIELDS},brand,tags`;

type GetProductsParams = {
  skip: number;
  limit: number;
  filters: ProductFilters;
  signal?: AbortSignal;
};

export function getProducts({
  skip,
  limit,
  filters,
  signal,
}: GetProductsParams) {
  const { query, category, sort } = filters;
  let path = '/products';

  if (query) {
    path = '/products/search';
  } else if (category) {
    path = `/products/category/${encodeURIComponent(category)}`;
  }

  return request<ProductsPage>(path, {
    params: {
      q: query || undefined,
      skip,
      limit,
      select: SUMMARY_FIELDS,
      ...getServerSort(sort),
    },
    signal,
  });
}

export async function getCatalog(signal?: AbortSignal) {
  const { products } = await request<{ products: CatalogProduct[] }>(
    '/products',
    { params: { limit: 0, select: CATALOG_FIELDS }, signal },
  );

  return products;
}

export async function getSimilarCandidates(
  category: string,
  signal?: AbortSignal,
) {
  const { products } = await request<{ products: SimilarCandidate[] }>(
    `/products/category/${encodeURIComponent(category)}`,
    { params: { limit: 0, select: SIMILAR_FIELDS }, signal },
  );

  return products;
}

export function getProductById(id: number, signal?: AbortSignal) {
  return request<Product>(`/products/${id}`, { signal });
}
