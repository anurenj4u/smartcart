import {
  countActiveRefinements,
  DEFAULT_REFINEMENTS,
  parsePriceInput,
} from '../refinements';

describe('countActiveRefinements', () => {
  it('counts nothing for the defaults', () => {
    expect(countActiveRefinements(DEFAULT_REFINEMENTS)).toBe(0);
  });

  it('counts a price range as one refinement', () => {
    expect(
      countActiveRefinements({
        ...DEFAULT_REFINEMENTS,
        minPrice: 5,
        maxPrice: 10,
      }),
    ).toBe(1);
  });

  it('counts sort, price and rating separately', () => {
    expect(
      countActiveRefinements({
        sort: 'price-asc',
        minPrice: 5,
        maxPrice: null,
        minRating: 4,
      }),
    ).toBe(3);
  });
});

describe('parsePriceInput', () => {
  it('treats blank input as no limit', () => {
    expect(parsePriceInput('  ')).toBeNull();
  });

  it.each([
    ['0', 0],
    ['25', 25],
    [' 19.99 ', 19.99],
  ])('parses %s', (input, expected) => {
    expect(parsePriceInput(input)).toBe(expected);
  });

  it.each(['abc', '1.', '.5', '1.234', '-1', '1,5'])('rejects %s', input => {
    expect(parsePriceInput(input)).toBeUndefined();
  });
});
