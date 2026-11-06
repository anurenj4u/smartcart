import { request } from '@/shared/api';
import type { Category } from '../types';

export function getCategories(signal?: AbortSignal) {
  return request<Category[]>('/products/categories', { signal });
}
