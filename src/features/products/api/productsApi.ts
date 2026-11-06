import { request } from '@/shared/api';
import type { Product, ProductsPage } from '../types';

const SUMMARY_FIELDS =
  'title,price,discountPercentage,rating,stock,thumbnail';

type GetProductsParams = {
  skip: number;
  limit: number;
  signal?: AbortSignal;
};

export function getProducts({ skip, limit, signal }: GetProductsParams) {
  return request<ProductsPage>('/products', {
    params: { skip, limit, select: SUMMARY_FIELDS },
    signal,
  });
}

export function getProductById(id: number, signal?: AbortSignal) {
  return request<Product>(`/products/${id}`, { signal });
}
