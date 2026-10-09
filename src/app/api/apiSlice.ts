import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';
import { logout, setCredentials } from '@/feature/auth/authSlice';
import type { ClinsyncApiError, LoginResponse } from '@/feature/auth/authApiSlice.types';

const { MODE, DEV, VITE_AUTH_API_URL, VITE_CLINSYNC_API_URL } = import.meta.env;
const IS_TESTING = MODE === 'test';

/** AUTH clock can be ahead of ClinSync; retry once before logout. */
export const INVALID_TOKEN_RETRY_DELAY_MS = 1000;

type ClinsyncExtraOptions = { invalidTokenRetried?: boolean };

// In dev, requests go to same-origin paths so the Vite proxy (see vite.config.ts)
// forwards them server-side, avoiding browser CORS. Builds hit the real URLs directly.
const AUTH_BASE_URL = IS_TESTING ? VITE_AUTH_API_URL : DEV ? '/api_auth' : VITE_AUTH_API_URL;
const CLINSYNC_BASE_URL = IS_TESTING ? VITE_CLINSYNC_API_URL : DEV ? '' : VITE_CLINSYNC_API_URL;

const prepareHeaders = (headers: Headers, { getState }: { getState: () => unknown }) => {
  const token = (getState() as RootState).auth.token;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return headers;
};

const authBaseQuery = fetchBaseQuery({
  baseUrl: AUTH_BASE_URL,
  credentials: 'include',
  prepareHeaders,
});
const clinsyncBaseQuery = fetchBaseQuery({ baseUrl: CLINSYNC_BASE_URL, prepareHeaders });

// One refresh HTTP call at a time (AUTH may rotate the refresh cookie per request).
let refreshInFlight: Promise<LoginResponse | null> | null = null;

export function requestRefreshToken(
  dispatch: (action: unknown) => unknown,
): Promise<LoginResponse | null> {
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    const refreshResponse = await fetch(`${AUTH_BASE_URL}/centralauth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!refreshResponse.ok) {
      return null;
    }

    const refreshResult = (await refreshResponse.json()) as LoginResponse;
    dispatch(setCredentials(refreshResult));
    return refreshResult;
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

const refreshAccessToken = async (dispatch: (action: unknown) => unknown) => {
  const result = await requestRefreshToken(dispatch);
  if (!result) {
    dispatch(logout());
    throw new Error('Refresh failed');
  }
};

// The ClinSync backend's `error.code` (e.g. 'token_expired'), or undefined.
export const getClinsyncErrorCode = (error: FetchBaseQueryError | undefined) =>
  (error?.data as ClinsyncApiError | undefined)?.error?.code;

type AppBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>;

const baseQueryWithReauth: AppBaseQuery = async (args, api, extraOptions) => {
  const url = typeof args === 'string' ? args : args.url;

  if (url === '/centralauth/refresh') {
    const refreshResult = await requestRefreshToken(api.dispatch);
    if (refreshResult) {
      return { data: refreshResult };
    }
    return {
      error: {
        status: 401,
        data: { detail: 'Refresh token not found or expired' },
      },
    };
  }

  let result = await authBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && url !== '/centralauth/refresh') {
    const token = (api.getState() as RootState).auth.token;
    if (token) {
      try {
        await refreshAccessToken(api.dispatch);
        result = await authBaseQuery(args, api, extraOptions);
      } catch {
        return result;
      }
    }
  }

  return result;
};

const clinsyncBaseQueryWithReauth: AppBaseQuery = async (args, api, extraOptions) => {
  const opts = (extraOptions ?? {}) as ClinsyncExtraOptions;
  const url = typeof args === 'string' ? args : args.url;
  const isSessionRequest = url.includes('/session');

  let result = await clinsyncBaseQuery(args, api, extraOptions);
  let code = getClinsyncErrorCode(result.error);

  if (result.error?.status === 401 && code === 'token_expired') {
    try {
      await refreshAccessToken(api.dispatch);
      result = await clinsyncBaseQuery(args, api, extraOptions);
      code = getClinsyncErrorCode(result.error);
    } catch {
      return result;
    }
  }

  // Clock skew: AUTH `iat` can be ahead of ClinSync; same token often works after a short wait.
  if (
    isSessionRequest &&
    result.error?.status === 401 &&
    code === 'invalid_token' &&
    !opts.invalidTokenRetried
  ) {
    await new Promise((resolve) => setTimeout(resolve, INVALID_TOKEN_RETRY_DELAY_MS));
    return clinsyncBaseQueryWithReauth(args, api, { ...extraOptions, invalidTokenRetried: true });
  }

  if (result.error?.status === 401 && code === 'invalid_token') {
    api.dispatch(logout());
  }

  return result;
};

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User'],
  endpoints: () => ({}),
});

export const clinsyncApiSlice = createApi({
  reducerPath: 'clinsyncApi',
  baseQuery: clinsyncBaseQueryWithReauth,
  tagTypes: ['Session'],
  endpoints: () => ({}),
});
