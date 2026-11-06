import { QueryClient } from '@tanstack/react-query';
import { isRetryableError } from './errors';

const MAX_RETRIES = 2;
const MAX_RETRY_DELAY_MS = 10_000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000,
      retry: (failureCount, error) =>
        failureCount < MAX_RETRIES && isRetryableError(error),
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, MAX_RETRY_DELAY_MS),
    },
    mutations: {
      networkMode: 'always',
      retry: false,
    },
  },
});
