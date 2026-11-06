import type { CartItem } from '../types';

export type CartTotals = {
  itemCount: number;
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
};

export function getCartTotals(items: CartItem[]): CartTotals {
  return items.reduce<CartTotals>(
    (totals, { listCents, unitCents, quantity }) => ({
      itemCount: totals.itemCount + quantity,
      subtotalCents: totals.subtotalCents + listCents * quantity,
      discountCents: totals.discountCents + (listCents - unitCents) * quantity,
      totalCents: totals.totalCents + unitCents * quantity,
    }),
    { itemCount: 0, subtotalCents: 0, discountCents: 0, totalCents: 0 },
  );
}
