import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../api/categoriesApi';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: ({ signal }) => getCategories(signal),
    staleTime: 24 * 60 * 60 * 1000,
  });
}
