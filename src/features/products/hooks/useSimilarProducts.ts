import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getSimilarCandidates } from '../api/productsApi';
import { productKeys } from '../api/queryKeys';
import type { Product } from '../types';
import { rankSimilarProducts } from '../utils/similarProducts';

const SIMILAR_PRODUCTS_LIMIT = 6;

export function useSimilarProducts(product: Product) {
  const { data: candidates, ...query } = useQuery({
    queryKey: productKeys.similarCandidates(product.category),
    queryFn: ({ signal }) => getSimilarCandidates(product.category, signal),
  });

  const similarProducts = useMemo(
    () =>
      candidates &&
      rankSimilarProducts(product, candidates, SIMILAR_PRODUCTS_LIMIT),
    [product, candidates],
  );

  return { ...query, similarProducts };
}
