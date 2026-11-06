import { useQuery } from '@tanstack/react-query';
import { getProductById } from '../api/productsApi';
import { productKeys } from '../api/queryKeys';

export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: ({ signal }) => getProductById(id, signal),
  });
}
