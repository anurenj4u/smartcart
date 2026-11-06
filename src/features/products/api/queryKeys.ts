import type { ProductFilters } from '@/features/catalog';

export const productKeys = {
  all: ['products'] as const,
  catalog: () => [...productKeys.all, 'catalog'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  detail: (id: number) => [...productKeys.all, 'detail', id] as const,
  similarCandidates: (category: string) =>
    [...productKeys.all, 'similar-candidates', category] as const,
};
