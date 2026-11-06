/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '@/app/App';

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
