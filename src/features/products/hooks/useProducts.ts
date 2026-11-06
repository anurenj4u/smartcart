import {
  keepPreviousData,
  useInfiniteQuery,
  type InfiniteData,
} from '@tanstack/react-query';
import { getProducts } from '../api/productsApi';
import { productKeys } from '../api/queryKeys';
import type { ProductsPage } from '../types';

const PAGE_SIZE = 20;

const flattenPages = (data: InfiniteData<ProductsPage>) =>
  data.pages.flatMap(page => page.products);

export function useProducts(category: string | null) {
  return useInfiniteQuery({
    queryKey: productKeys.list(category),
    queryFn: ({ pageParam, signal }) =>
      getProducts({ skip: pageParam, limit: PAGE_SIZE, category, signal }),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      const nextSkip = lastPage.skip + lastPage.products.length;
      return lastPage.products.length > 0 && nextSkip < lastPage.total
        ? nextSkip
        : undefined;
    },
    select: flattenPages,
    placeholderData: keepPreviousData,
  });
}
