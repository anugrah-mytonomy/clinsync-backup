export interface ApiErrorData {
  detail?: string | { msg: string }[];
}

export interface ApiError {
  status: number;
  data: ApiErrorData;
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'status' in error && 'data' in error;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Unable to sign in. Please try again.',
): string {
  if (!isApiError(error)) {
    return fallback;
  }

  const { detail } = error.data;

  if (typeof detail === 'string') {
    return detail;
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail[0].msg;
  }

  return fallback;
}
