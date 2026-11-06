import type { ProductFilters } from '@/features/catalog';
import { makeProduct } from '../../../../../test-utils';
import {
  filterCatalog,
  getServerSort,
  needsCatalog,
  paginate,
} from '../productFilters';

const noFilters: ProductFilters = {
  query: '',
  category: null,
  sort: 'default',
  minPrice: null,
  maxPrice: null,
  minRating: null,
};

const catalog = [
  makeProduct(1, {
    title: 'Red phone',
    category: 'phones',
    price: 100,
    discountPercentage: 50,
  }),
  makeProduct(2, { description: 'A PHONE case', category: 'cases', price: 60 }),
  makeProduct(3, {
    category: 'phones',
    price: 80,
    discountPercentage: 10,
    rating: 3.96,
  }),
  makeProduct(4, { category: 'phones', price: 10, rating: 3.94 }),
];

const ids = (products: { id: number }[]) => products.map(({ id }) => id);

describe('needsCatalog', () => {
  it.each<[string, Partial<ProductFilters>]>([
    ['no filters', {}],
    ['search only', { query: 'phone' }],
    ['category only', { category: 'phones' }],
    ['top rated sort', { sort: 'rating-desc' }],
  ])('uses the server for %s', (_, filters) => {
    expect(needsCatalog({ ...noFilters, ...filters })).toBe(false);
  });

  it.each<[string, Partial<ProductFilters>]>([
    ['search with a category', { query: 'phone', category: 'phones' }],
    ['ascending price sort', { sort: 'price-asc' }],
    ['descending price sort', { sort: 'price-desc' }],
    ['a minimum price', { minPrice: 0 }],
    ['a maximum price', { maxPrice: 0 }],
    ['a minimum rating', { minRating: 4 }],
  ])('uses the catalog for %s', (_, filters) => {
    expect(needsCatalog({ ...noFilters, ...filters })).toBe(true);
  });
});

describe('getServerSort', () => {
  it('asks the server for top rated products', () => {
    expect(getServerSort('rating-desc')).toEqual({
      sortBy: 'rating',
      order: 'desc',
    });
  });

  it('sends no sort otherwise', () => {
    expect(getServerSort('default')).toEqual({
      sortBy: undefined,
      order: undefined,
    });
  });
});

describe('filterCatalog', () => {
  it('searches titles and descriptions, ignoring case', () => {
    expect(
      ids(filterCatalog(catalog, { ...noFilters, query: 'PHONE' })),
    ).toEqual([1, 2]);
  });

  it('combines search with a category', () => {
    expect(
      ids(
        filterCatalog(catalog, {
          ...noFilters,
          query: 'phone',
          category: 'phones',
        }),
      ),
    ).toEqual([1]);
  });

  it('sorts by the discounted price shown to the user', () => {
    expect(
      ids(filterCatalog(catalog, { ...noFilters, sort: 'price-asc' })),
    ).toEqual([4, 1, 2, 3]);
    expect(
      ids(filterCatalog(catalog, { ...noFilters, sort: 'price-desc' })),
    ).toEqual([3, 2, 1, 4]);
  });

  it('applies inclusive price limits to the discounted price', () => {
    expect(
      ids(filterCatalog(catalog, { ...noFilters, minPrice: 50, maxPrice: 50 })),
    ).toEqual([1]);
  });

  it('compares ratings as they are displayed', () => {
    expect(ids(filterCatalog(catalog, { ...noFilters, minRating: 4 }))).toEqual(
      [1, 2, 3],
    );
  });

  it('does not reorder the original catalog', () => {
    filterCatalog(catalog, { ...noFilters, sort: 'price-asc' });
    expect(ids(catalog)).toEqual([1, 2, 3, 4]);
  });
});

describe('paginate', () => {
  it('returns one page with the total match count', () => {
    const page = paginate(catalog, 1, 2);

    expect(ids(page.products)).toEqual([2, 3]);
    expect(page).toMatchObject({ total: 4, skip: 1, limit: 2 });
  });

  it('returns an empty page past the end', () => {
    expect(paginate(catalog, 10, 2).products).toEqual([]);
  });
});
