import type { ProductRefinements } from '../types';

export const DEFAULT_REFINEMENTS: ProductRefinements = {
  sort: 'default',
  minPrice: null,
  maxPrice: null,
  minRating: null,
};

export function countActiveRefinements({
  sort,
  minPrice,
  maxPrice,
  minRating,
}: ProductRefinements): number {
  return [
    sort !== 'default',
    minPrice !== null || maxPrice !== null,
    minRating !== null,
  ].filter(Boolean).length;
}

export function parsePriceInput(text: string): number | null | undefined {
  const value = text.trim();

  if (!value) {
    return null;
  }

  return /^\d+(\.\d{1,2})?$/.test(value) ? Number(value) : undefined;
}
