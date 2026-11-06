import { useCallback, useMemo, useState } from 'react';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import type { ProductFilters } from '../types';

const SEARCH_DEBOUNCE_MS = 400;

export function useProductFilters() {
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const query = useDebouncedValue(searchText.trim(), SEARCH_DEBOUNCE_MS);

  const filters = useMemo<ProductFilters>(
    () => ({ query, category }),
    [query, category],
  );

  const reset = useCallback(() => {
    setSearchText('');
    setCategory(null);
  }, []);

  return {
    filters,
    searchText,
    setSearchText,
    setCategory,
    hasActiveFilters: searchText.trim() !== '' || category !== null,
    reset,
  };
}
