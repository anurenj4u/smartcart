/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '@/app/App';
import { queryClient } from '@/shared/api';

const emptyPage = { products: [], total: 0, skip: 0, limit: 20 };

beforeEach(() => {
  globalThis.fetch = jest.fn(async () => ({
    ok: true,
    status: 200,
    text: async () => JSON.stringify(emptyPage),
  })) as unknown as typeof fetch;
});

afterEach(() => {
  queryClient.clear();
});

test('renders correctly', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
    await new Promise<void>(resolve => setImmediate(resolve));
  });

  expect(renderer?.toJSON()).not.toBeNull();

  await ReactTestRenderer.act(async () => {
    renderer?.unmount();
  });
});
