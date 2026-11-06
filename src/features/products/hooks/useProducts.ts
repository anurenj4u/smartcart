import { useInfiniteQuery } from '@tanstack/react-query';
import { getProducts } from '../api/productsApi';
import { productKeys } from '../api/queryKeys';

const PAGE_SIZE = 20;

export function useProducts() {
  return useInfiniteQuery({
    queryKey: productKeys.lists(),
    queryFn: ({ pageParam, signal }) =>
      getProducts({ skip: pageParam, limit: PAGE_SIZE, signal }),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      const nextSkip = lastPage.skip + lastPage.products.length;
      return lastPage.products.length > 0 && nextSkip < lastPage.total
        ? nextSkip
        : undefined;
    },
    select: data => data.pages.flatMap(page => page.products),
  });
}
