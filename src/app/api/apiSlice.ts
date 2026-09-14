import { createApi, fetchBaseQuery, type BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@/app/store';
import { logout, setCredentials } from '@/feature/auth/authSlice';
import type { LoginResponse } from '@/feature/auth/authApiSlice.types';

const { MODE, DEV, VITE_AUTH_API_URL } = import.meta.env;
const IS_TESTING = MODE === 'test';

// In dev, requests go to the same-origin `/api_auth` path so the Vite proxy
// (see vite.config.ts) forwards them server-side, avoiding browser CORS
// against the real Auth Service. Builds hit VITE_AUTH_API_URL directly.
const AUTH_BASE_URL = IS_TESTING ? VITE_AUTH_API_URL : DEV ? '/api_auth' : VITE_AUTH_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: AUTH_BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

let refreshPromise: Promise<void> | null = null;

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const url = typeof args === 'string' ? args : args.url;

  if (result.error?.status === 401 && url !== '/centralauth/refresh') {
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
          api.dispatch(setCredentials(refreshResult));
        } catch {
          api.dispatch(logout());
          throw new Error('Refresh failed');
        } finally {
          refreshPromise = null;
        }
      })();
    }

    try {
      await refreshPromise;
      result = await baseQuery(args, api, extraOptions);
    } catch {
      return result;
    }
  }

  return result;
};

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User'],
  endpoints: () => ({}),
});
