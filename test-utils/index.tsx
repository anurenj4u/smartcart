import {
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';

const clients: QueryClient[] = [];

afterEach(() => {
  clients.splice(0).forEach(client => client.clear());
  onlineManager.setOnline(true);
});

export function renderWithClient(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 60 * 1000 },
      mutations: { networkMode: 'always', retry: false },
    },
  });
  clients.push(client);

  return {
    client,
    ...render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>),
  };
}

export type TestProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  thumbnail: string;
};

export function makeProduct(
  id: number,
  overrides: Partial<TestProduct> = {},
): TestProduct {
  return {
    id,
    title: `Item ${id}`,
    description: 'A plain product',
    category: 'general',
    price: 100,
    discountPercentage: 0,
    rating: 4,
    stock: 5,
    thumbnail: `https://example.test/${id}.webp`,
    ...overrides,
  };
}

function respond(body: unknown, status = 200) {
  return {
    ok: status < 400,
    status,
    text: async () => JSON.stringify(body),
  };
}

export function mockApi(catalog: TestProduct[]) {
  const route = (url: string) => {
    const { pathname, searchParams } = new URL(url);
    const limit = Number(searchParams.get('limit') ?? 30);
    const skip = Number(searchParams.get('skip') ?? 0);

    if (pathname === '/products/categories') {
      return [
        { slug: 'beauty', name: 'Beauty' },
        { slug: 'phones', name: 'Phones' },
      ];
    }

    let matches = catalog;

    if (pathname === '/products/search') {
      const query = (searchParams.get('q') ?? '').toLowerCase();
      matches = catalog.filter(product =>
        `${product.title} ${product.description}`.toLowerCase().includes(query),
      );
    } else if (pathname.startsWith('/products/category/')) {
      const category = decodeURIComponent(pathname.split('/').pop() ?? '');
      matches = catalog.filter(product => product.category === category);
    }

    return {
      products: limit === 0 ? matches : matches.slice(skip, skip + limit),
      total: matches.length,
      skip,
      limit,
    };
  };

  const fetchMock = jest.fn(async (url: string) => respond(route(url)));
  globalThis.fetch = fetchMock as unknown as typeof fetch;

  const urls = () => fetchMock.mock.calls.map(([url]) => url);

  return {
    fetchMock,
    urls,
    pageRequests: () =>
      urls().filter(
        url => url.includes('/products') && !/limit=0|categories/.test(url),
      ),
    failNext: () =>
      fetchMock.mockImplementationOnce(async () => {
        throw new TypeError('Network request failed');
      }),
    failAll: () =>
      fetchMock.mockImplementation(async () => {
        throw new TypeError('Network request failed');
      }),
    restore: () =>
      fetchMock.mockImplementation(async (url: string) => respond(route(url))),
  };
}
