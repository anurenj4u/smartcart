import { toCents } from './money';

type PricedProduct = {
  price: number;
  discountPercentage: number;
};

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
