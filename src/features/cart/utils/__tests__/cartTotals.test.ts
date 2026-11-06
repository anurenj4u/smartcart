import type { CartItem } from '../../types';
import { getCartTotals } from '../cartTotals';

const item = (overrides: Partial<CartItem>): CartItem => ({
  productId: 1,
  title: 'Item',
  thumbnail: 'thumbnail',
  listCents: 1000,
  unitCents: 1000,
  stock: 5,
  quantity: 1,
  ...overrides,
});

describe('getCartTotals', () => {
  it('returns zeros for an empty cart', () => {
    expect(getCartTotals([])).toEqual({
      itemCount: 0,
      subtotalCents: 0,
      discountCents: 0,
      totalCents: 0,
    });
  });

  it('multiplies by quantity and adds up discounts', () => {
    expect(
      getCartTotals([
        item({ listCents: 1010, unitCents: 909, quantity: 2 }),
        item({ productId: 2, listCents: 1999, unitCents: 1749, quantity: 1 }),
      ]),
    ).toEqual({
      itemCount: 3,
      subtotalCents: 4019,
      discountCents: 452,
      totalCents: 3567,
    });
  });

  it('keeps subtotal minus discount equal to the total', () => {
    const { subtotalCents, discountCents, totalCents } = getCartTotals([
      item({ listCents: 999, unitCents: 894, quantity: 3 }),
      item({ productId: 2, listCents: 1, unitCents: 1, quantity: 7 }),
    ]);

    expect(subtotalCents - discountCents).toBe(totalCents);
  });
});
