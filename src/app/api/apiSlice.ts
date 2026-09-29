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

// Shared by both slices so parallel 401s trigger a single refresh call.
let refreshPromise: Promise<void> | null = null;

const refreshAccessToken = (dispatch: (action: unknown) => unknown) => {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshResponse = await fetch(`${AUTH_BASE_URL}/centralauth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });

        if (!refreshResponse.ok) {
          throw new Error('Refresh failed');
        }

        const refreshResult = (await refreshResponse.json()) as LoginResponse;
        dispatch(setCredentials(refreshResult));
      } catch {
        dispatch(logout());
        throw new Error('Refresh failed');
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
};

// The ClinSync backend's `error.code` (e.g. 'token_expired'), or undefined.
export const getClinsyncErrorCode = (error: FetchBaseQueryError | undefined) =>
  (error?.data as ClinsyncApiError | undefined)?.error?.code;

type AppBaseQuery = BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>;

const baseQueryWithReauth: AppBaseQuery = async (args, api, extraOptions) => {
  let result = await authBaseQuery(args, api, extraOptions);
  const url = typeof args === 'string' ? args : args.url;

  if (result.error?.status === 401 && url !== '/centralauth/refresh') {
    try {
      await refreshAccessToken(api.dispatch);
      result = await authBaseQuery(args, api, extraOptions);
    } catch {
      return result;
    }
  }

  return result;
};

const clinsyncBaseQueryWithReauth: AppBaseQuery = async (args, api, extraOptions) => {
  let result = await clinsyncBaseQuery(args, api, extraOptions);
  const code = getClinsyncErrorCode(result.error);

  if (result.error?.status === 401 && code === 'token_expired') {
    try {
      await refreshAccessToken(api.dispatch);
      result = await clinsyncBaseQuery(args, api, extraOptions);
    } catch {
      return result;
    }
  } else if (result.error?.status === 401 && code === 'invalid_token') {
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
