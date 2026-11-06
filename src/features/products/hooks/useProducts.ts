import {
  keepPreviousData,
  onlineManager,
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import type { ProductFilters } from '@/features/catalog';
import { ApiError } from '@/shared/api';
import { useIsOnline } from '@/shared/network/online';
import { getCatalog, getProducts } from '../api/productsApi';
import { productKeys } from '../api/queryKeys';
import type { CatalogProduct, ProductsPage } from '../types';
import { filterCatalog, needsCatalog, paginate } from '../utils/productFilters';

const PAGE_SIZE = 20;
const CATALOG_STALE_TIME_MS = 5 * 60 * 1000;

const flattenPages = (data: InfiniteData<ProductsPage>) =>
  data.pages.flatMap(page => page.products);

export function useProducts(filters: ProductFilters) {
  const queryClient = useQueryClient();
  const isOnline = useIsOnline();
  const hasCatalog =
    queryClient.getQueryData(productKeys.catalog()) !== undefined;
  const usesCatalog = needsCatalog(filters) || (!isOnline && hasCatalog);

  const fetchCatalog = () =>
    queryClient.fetchQuery({
      queryKey: productKeys.catalog(),
      queryFn: ({ signal }) => getCatalog(signal),
      staleTime: CATALOG_STALE_TIME_MS,
    });

  useEffect(() => {
    if (isOnline) {
      queryClient.prefetchQuery({
        queryKey: productKeys.catalog(),
        queryFn: ({ signal }) => getCatalog(signal),
        staleTime: CATALOG_STALE_TIME_MS,
      });
    }
  }, [isOnline, queryClient]);

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

      const cachedCatalog = queryClient.getQueryData<CatalogProduct[]>(
        productKeys.catalog(),
      );

      if (!onlineManager.isOnline() && !cachedCatalog) {
        throw new ApiError('network', 'The catalog is not available offline');
      }

      const catalog = onlineManager.isOnline()
        ? await fetchCatalog()
        : cachedCatalog!;

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
    networkMode: usesCatalog ? 'offlineFirst' : 'online',
  });

  const refresh = async () => {
    if (!onlineManager.isOnline()) {
      return;
    }

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
