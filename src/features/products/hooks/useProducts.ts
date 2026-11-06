import {
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import type { ProductFilters } from '@/features/catalog';
import { getCatalog, getProducts } from '../api/productsApi';
import { productKeys } from '../api/queryKeys';
import type { ProductsPage } from '../types';
import { filterCatalog, needsCatalog, paginate } from '../utils/productFilters';

const PAGE_SIZE = 20;
const CATALOG_STALE_TIME_MS = 5 * 60 * 1000;

const flattenPages = (data: InfiniteData<ProductsPage>) =>
  data.pages.flatMap(page => page.products);

export function useProducts(filters: ProductFilters) {
  const queryClient = useQueryClient();
  const usesCatalog = needsCatalog(filters);

  const query = useInfiniteQuery({
    queryKey: productKeys.list(filters),
    queryFn: async ({ pageParam, signal }) => {
      if (!usesCatalog) {
        return getProducts({
          skip: pageParam,
          limit: PAGE_SIZE,
          filters,
          signal,
        });
      }

      const catalog = await queryClient.fetchQuery({
        queryKey: productKeys.catalog(),
        queryFn: ({ signal: catalogSignal }) => getCatalog(catalogSignal),
        staleTime: CATALOG_STALE_TIME_MS,
      });

      return paginate(filterCatalog(catalog, filters), pageParam, PAGE_SIZE);
    },
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

  const refresh = async () => {
    if (usesCatalog) {
      await queryClient.invalidateQueries({
        queryKey: productKeys.catalog(),
        refetchType: 'none',
      });
    }
    await query.refetch();
  };

  return { ...query, refresh };
}
