import { configureStore } from '@reduxjs/toolkit';
import { authApiSlice, clinsyncApiSlice } from '@/app/api/apiSlice';
import authReducer from '@/feature/auth/authSlice';

export const setupStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      [authApiSlice.reducerPath]: authApiSlice.reducer,
      [clinsyncApiSlice.reducerPath]: clinsyncApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApiSlice.middleware, clinsyncApiSlice.middleware),
  });

export const store = setupStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = ReturnType<typeof setupStore>;
