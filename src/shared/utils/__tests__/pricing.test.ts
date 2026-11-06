import { formatCents, toCents } from '../money';
import { getProductPricing } from '../pricing';

describe('toCents', () => {
  it('avoids floating point errors', () => {
    expect(toCents(0.1) + toCents(0.2)).toBe(30);
    expect(toCents(19.99)).toBe(1999);
    expect(toCents(1.005 * 100) / 100).toBe(100.5);
  });
});

describe('formatCents', () => {
  it.each([
    [0, '$0.00'],
    [5, '$0.05'],
    [1999, '$19.99'],
    [3699999, '$36999.99'],
  ])('formats %i as %s', (cents, expected) => {
    expect(formatCents(cents)).toBe(expected);
  });
});

describe('getProductPricing', () => {
  it('rounds the discounted price to the nearest cent', () => {
    expect(
      getProductPricing({ price: 9.99, discountPercentage: 10.48 }),
    ).toEqual({ listCents: 999, finalCents: 894, hasDiscount: true });
  });

  it('reports no discount when the price is unchanged', () => {
    expect(getProductPricing({ price: 10, discountPercentage: 0 })).toEqual({
      listCents: 1000,
      finalCents: 1000,
      hasDiscount: false,
    });
  });
});
