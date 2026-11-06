import type { SimilarCandidate } from '../../types';
import { rankSimilarProducts } from '../similarProducts';

const candidate = (
  id: number,
  overrides: Partial<SimilarCandidate> = {},
): SimilarCandidate => ({
  id,
  title: `Item ${id}`,
  price: 100,
  discountPercentage: 0,
  rating: 4,
  stock: 5,
  thumbnail: 'thumbnail',
  tags: [],
  ...overrides,
});

const target = candidate(1, { tags: ['a', 'b'], brand: 'Acme' });
const ranked = (candidates: SimilarCandidate[], limit = 10) =>
  rankSimilarProducts(target, candidates, limit).map(({ id }) => id);

describe('rankSimilarProducts', () => {
  it('leaves out the current product', () => {
    expect(ranked([target, candidate(2)])).toEqual([2]);
  });

  it('returns nothing when there are no other products', () => {
    expect(ranked([target])).toEqual([]);
  });

  it('respects the limit', () => {
    expect(ranked([candidate(2), candidate(3), candidate(4)], 2)).toHaveLength(
      2,
    );
  });

  it('ranks more shared tags higher', () => {
    expect(
      ranked([
        candidate(2, { tags: ['a'] }),
        candidate(3, { tags: ['a', 'b'] }),
        candidate(4),
      ]),
    ).toEqual([3, 2, 4]);
  });

  it('matches tags and brands regardless of case', () => {
    expect(ranked([candidate(2), candidate(3, { tags: [' A '] })])).toEqual([
      3, 2,
    ]);
    expect(ranked([candidate(2), candidate(3, { brand: 'ACME' })])).toEqual([
      3, 2,
    ]);
  });

  it('prefers a shared tag over the same brand', () => {
    expect(
      ranked([candidate(2, { brand: 'Acme' }), candidate(3, { tags: ['a'] })]),
    ).toEqual([3, 2]);
  });

  it('does not treat two products without a brand as a match', () => {
    const noBrand = candidate(1, { tags: [] });

    expect(
      rankSimilarProducts(noBrand, [candidate(3), candidate(2)], 2).map(
        ({ id }) => id,
      ),
    ).toEqual([2, 3]);
  });

  it('prefers closer prices using the discounted price', () => {
    expect(
      ranked([
        candidate(2, { price: 1000 }),
        candidate(3, { price: 200, discountPercentage: 50 }),
      ]),
    ).toEqual([3, 2]);
  });

  it('uses rating to separate otherwise equal products', () => {
    expect(
      ranked([candidate(2, { rating: 3 }), candidate(3, { rating: 5 })]),
    ).toEqual([3, 2]);
  });

  it('moves sold out products down without hiding them', () => {
    expect(
      ranked([
        candidate(2, { tags: ['a'], stock: 0 }),
        candidate(3, { tags: ['a'] }),
      ]),
    ).toEqual([3, 2]);
  });

  it('breaks ties by id so the order never changes', () => {
    expect(ranked([candidate(4), candidate(2), candidate(3)])).toEqual([
      2, 3, 4,
    ]);
  });

  it('handles free products', () => {
    const free = candidate(1, { price: 0 });

    expect(
      rankSimilarProducts(free, [candidate(2, { price: 0 })], 1),
    ).toHaveLength(1);
  });

  it('does not change the original list', () => {
    const candidates = [candidate(3), candidate(2)];

    rankSimilarProducts(target, candidates, 2);

    expect(candidates.map(({ id }) => id)).toEqual([3, 2]);
  });
});
