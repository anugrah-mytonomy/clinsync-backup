import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { Provider } from 'react-redux';
import { setupStore } from '@/app/store';
import { setCredentials } from '@/feature/auth/authSlice';
import type { Session } from '@/feature/auth/authApiSlice.types';
import { hasPermission, useHasPermission, useOrganization, useSession } from '@/hooks/useAuth';
import { mockSession } from '@/mocks/handlers';
import { server } from '@/mocks/server';

const renderWithToken = <T,>(hook: () => T, token: string | null) => {
  const store = setupStore();
  if (token) store.dispatch(setCredentials({ access_token: token, expires_in: 3600 }));

  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return { store, ...renderHook(hook, { wrapper }) };
};

describe('hasPermission', () => {
  const permissions: Session['permissions'] = {
    DA: ['read'],
    LB: ['read', 'upload'],
    SH: ['modify'],
  };

  it('grants actions that are listed', () => {
    expect(hasPermission(permissions, 'DA', 'read')).toBe(true);
    expect(hasPermission(permissions, 'LB', 'upload')).toBe(true);
    expect(hasPermission(permissions, 'SH', 'modify')).toBe(true);
  });

  it('treats modify as implying read', () => {
    expect(hasPermission(permissions, 'SH', 'read')).toBe(true);
  });

  it('does not let read or upload imply other actions', () => {
    expect(hasPermission(permissions, 'DA', 'modify')).toBe(false);
    expect(hasPermission({ LB: ['upload'] }, 'LB', 'read')).toBe(false);
  });

  it('denies everything for a missing menu or missing session', () => {
    expect(hasPermission({}, 'LB', 'read')).toBe(false);
    expect(hasPermission(undefined, 'DA', 'read')).toBe(false);
  });
});

describe('useSession', () => {
  it('sends the access token as a Bearer header and returns the session', async () => {
    let authorization: string | null = null;
    server.use(
      http.get('*/api/v1/session', ({ request }) => {
        authorization = request.headers.get('Authorization');
        return HttpResponse.json(mockSession);
      }),
    );

    const { result } = renderWithToken(() => useSession(), 'mock-token');

    await waitFor(() => expect(result.current.data).toEqual(mockSession));
    expect(authorization).toBe('Bearer mock-token');
  });

  it('skips the request when there is no token', () => {
    const { result } = renderWithToken(() => useSession(), null);

    expect(result.current.isUninitialized).toBe(true);
  });

  it('refreshes the token on token_expired and retries once', async () => {
    let refreshCalls = 0;
    server.use(
      http.post('*/centralauth/refresh', () => {
        refreshCalls += 1;
        return HttpResponse.json({ access_token: 'mock-token', expires_in: 3600 });
      }),
    );

    const { result, store } = renderWithToken(() => useSession(), 'expired-token');

    await waitFor(() => expect(result.current.data).toEqual(mockSession));
    expect(store.getState().auth.token).toBe('mock-token');
    expect(refreshCalls).toBe(1);
  });

  it('logs out when the refresh after token_expired fails', async () => {
    const { store } = renderWithToken(() => useSession(), 'expired-token');

    await waitFor(() => expect(store.getState().auth.token).toBeNull());
  });

  it('logs out on invalid_token', async () => {
    const { store } = renderWithToken(() => useSession(), 'invalid-token');

    await waitFor(() => expect(store.getState().auth.token).toBeNull());
  });

  it('returns the error code for a 403 without refreshing or logging out', async () => {
    const { result, store } = renderWithToken(() => useSession(), 'no-access-token');

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toMatchObject({ status: 403 });
    expect(store.getState().auth.token).toBe('no-access-token');
  });
});

describe('useHasPermission and useOrganization', () => {
  it('read permissions and the organization from the session', async () => {
    const { result } = renderWithToken(
      () => ({
        canReadScans: useHasPermission('SH', 'read'),
        canModifyDashboard: useHasPermission('DA', 'modify'),
        organization: useOrganization(),
      }),
      'mock-token',
    );

    await waitFor(() => expect(result.current.organization?.name).toBe('Mytonomy'));
    expect(result.current.canReadScans).toBe(true);
    expect(result.current.canModifyDashboard).toBe(false);
  });
});
