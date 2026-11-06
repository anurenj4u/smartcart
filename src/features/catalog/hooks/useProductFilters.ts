import { useCallback, useMemo, useState } from 'react';
import { useDebouncedValue } from '@/shared/hooks/useDebouncedValue';
import type { ProductFilters, ProductRefinements } from '../types';
import {
  countActiveRefinements,
  DEFAULT_REFINEMENTS,
} from '../utils/refinements';

const SEARCH_DEBOUNCE_MS = 400;

export function useProductFilters() {
  const [searchText, setSearchText] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [refinements, setRefinements] =
    useState<ProductRefinements>(DEFAULT_REFINEMENTS);
  const query = useDebouncedValue(searchText.trim(), SEARCH_DEBOUNCE_MS);

  const filters = useMemo<ProductFilters>(
    () => ({ ...refinements, query, category }),
    [refinements, query, category],
  );

  const reset = useCallback(() => {
    setSearchText('');
    setCategory(null);
    setRefinements(DEFAULT_REFINEMENTS);
  }, []);

  const activeRefinementCount = countActiveRefinements(refinements);

  return {
    filters,
    refinements,
    searchText,
    setSearchText,
    setCategory,
    setRefinements,
    activeRefinementCount,
    hasActiveFilters:
      searchText.trim() !== '' || category !== null || activeRefinementCount > 0,
    reset,
  };
}
