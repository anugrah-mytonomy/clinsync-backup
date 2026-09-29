import { authApiSlice, clinsyncApiSlice } from '@/app/api/apiSlice';
import type { LoginRequest, LoginResponse, Session } from '@/feature/auth/authApiSlice.types';

export type { LoginRequest, LoginResponse };

const injectedAuthApiSlice = authApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/centralauth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/centralauth/logout',
        method: 'POST',
        body: {},
      }),
      invalidatesTags: ['Auth'],
    }),
    refresh: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: '/centralauth/refresh',
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRefreshMutation } = injectedAuthApiSlice;

const injectedClinsyncApiSlice = clinsyncApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // The argument is the current access token. It isn't sent (the base query adds the
    // Authorization header); it keys the cache so a refreshed token refetches the session.
    getSession: builder.query<Session, string>({
      query: () => '/api/v1/session',
      providesTags: ['Session'],
    }),
  }),
});

export const { useGetSessionQuery } = injectedClinsyncApiSlice;
