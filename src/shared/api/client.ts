import { ApiError } from './errors';

const BASE_URL = 'https://dummyjson.com';
const DEFAULT_TIMEOUT_MS = 10_000;

type QueryParams = Record<string, string | number | undefined>;

type RequestOptions = {
  method?: 'GET' | 'POST';
  params?: QueryParams;
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
};

function buildUrl(path: string, params: QueryParams = {}): string {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join('&');

  return `${BASE_URL}${path}${query ? `?${query}` : ''}`;
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = 'GET',
    params,
    body,
    signal,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  const controller = new AbortController();
  const abort = () => controller.abort();
  let timedOut = false;

  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  if (signal?.aborted) {
    controller.abort();
  }
  signal?.addEventListener('abort', abort);

  let text: string;
  let response: Response;

  try {
    response = await fetch(buildUrl(path, params), {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    text = await response.text();
  } catch (error) {
    if (timedOut) {
      throw new ApiError('timeout', `Request to ${path} timed out`);
    }
    if (signal?.aborted) {
      throw error;
    }
    throw new ApiError('network', `Request to ${path} could not be completed`);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }

  if (!response.ok) {
    throw new ApiError(
      'http',
      `Request to ${path} failed with status ${response.status}`,
      response.status,
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError('parse', `Response from ${path} was not valid JSON`);
  }
}
