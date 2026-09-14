import { authApiSlice } from '@/app/api/apiSlice';
import type { LoginRequest, LoginResponse } from '@/feature/auth/authApiSlice.types';

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
