import { toCents } from '@/shared/utils/money';
import type { ProductSummary } from '../types';

type PricedProduct = Pick<ProductSummary, 'price' | 'discountPercentage'>;

export function getProductPricing({
  price,
  discountPercentage,
}: PricedProduct) {
  const listCents = toCents(price);
  const finalCents = Math.round(listCents * (1 - discountPercentage / 100));

  return {
    listCents,
    finalCents,
    hasDiscount: finalCents < listCents,
  };
}
