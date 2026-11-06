import { request } from '../client';
import { ApiError, getErrorMessage, isRetryableError } from '../errors';

const respond = (status: number, body: string) => ({
  ok: status < 400,
  status,
  text: async () => body,
});

const mockFetch = (implementation: (...args: any[]) => Promise<unknown>) => {
  const fetchMock = jest.fn(implementation);
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
};

const hangUntilAborted = (_: string, init: { signal: AbortSignal }) =>
  new Promise((_resolve, reject) => {
    init.signal.addEventListener('abort', () => reject(new Error('Aborted')));
  });

describe('request', () => {
  it('builds the URL and parses JSON', async () => {
    const fetchMock = mockFetch(async () => respond(200, '{"a":1}'));

    await expect(
      request('/products', { params: { q: 'a b', skip: undefined, limit: 2 } }),
    ).resolves.toEqual({ a: 1 });
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://dummyjson.com/products?q=a%20b&limit=2',
    );
  });

  it('sends JSON bodies', async () => {
    const fetchMock = mockFetch(async () => respond(200, '{}'));

    await request('/carts/add', { method: 'POST', body: { userId: 1 } });

    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: 'POST',
      body: '{"userId":1}',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('reports HTTP failures with their status', async () => {
    mockFetch(async () => respond(404, '{}'));

    await expect(request('/x')).rejects.toMatchObject({
      kind: 'http',
      status: 404,
    });
  });

  it('reports network failures', async () => {
    mockFetch(async () => {
      throw new TypeError('Network request failed');
    });

    await expect(request('/x')).rejects.toMatchObject({ kind: 'network' });
  });

  it('reports invalid JSON', async () => {
    mockFetch(async () => respond(200, 'not json'));

    await expect(request('/x')).rejects.toMatchObject({ kind: 'parse' });
  });

  it('times out slow requests', async () => {
    mockFetch(hangUntilAborted as (...args: any[]) => Promise<unknown>);

    await expect(request('/x', { timeoutMs: 5 })).rejects.toMatchObject({
      kind: 'timeout',
    });
  });

  it('passes through cancellation from the caller', async () => {
    mockFetch(hangUntilAborted as (...args: any[]) => Promise<unknown>);
    const controller = new AbortController();

    const result = request('/x', { signal: controller.signal }).catch(
      error => error,
    );
    controller.abort();

    expect(await result).not.toBeInstanceOf(ApiError);
  });
});

describe('isRetryableError', () => {
  it.each([
    ['a network failure', new ApiError('network', 'x')],
    ['a timeout', new ApiError('timeout', 'x')],
    ['a server error', new ApiError('http', 'x', 500)],
    ['rate limiting', new ApiError('http', 'x', 429)],
  ])('retries %s', (_, error) => {
    expect(isRetryableError(error)).toBe(true);
  });

  it.each([
    ['a missing resource', new ApiError('http', 'x', 404)],
    ['invalid JSON', new ApiError('parse', 'x')],
    ['an unknown error', new Error('x')],
  ])('does not retry %s', (_, error) => {
    expect(isRetryableError(error)).toBe(false);
  });
});

describe('getErrorMessage', () => {
  it('explains network failures', () => {
    expect(getErrorMessage(new ApiError('network', 'x'))).toContain(
      'internet connection',
    );
  });

  it('never exposes internal error text', () => {
    expect(getErrorMessage(new Error('secret detail'))).not.toContain('secret');
  });
});
