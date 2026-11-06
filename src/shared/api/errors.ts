export type ApiErrorKind = 'network' | 'timeout' | 'http' | 'parse';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

export function isRetryableError(error: unknown): boolean {
  if (!(error instanceof ApiError)) {
    return false;
  }

  if (error.kind === 'network' || error.kind === 'timeout') {
    return true;
  }

  return (
    error.kind === 'http' &&
    error.status !== undefined &&
    (error.status >= 500 || error.status === 408 || error.status === 429)
  );
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.kind) {
      case 'network':
        return 'Check your internet connection and try again.';
      case 'timeout':
        return 'The server took too long to respond. Please try again.';
      default:
        return 'Something went wrong on our side. Please try again.';
    }
  }

  return 'Something went wrong. Please try again.';
}
