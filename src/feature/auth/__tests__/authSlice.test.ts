import { describe, expect, it } from 'vitest';
import authReducer, { logout, setCredentials } from '@/feature/auth/authSlice';

describe('authSlice', () => {
  it('starts with no token', () => {
    const state = authReducer(undefined, { type: 'unknown' });
    expect(state).toEqual({ token: null });
  });

  it('sets the token after login', () => {
    const state = authReducer(
      undefined,
      setCredentials({ access_token: 'abc123', expires_in: 3600 }),
    );
    expect(state).toEqual({ token: 'abc123' });
  });

  it('clears the token on logout', () => {
    const authenticated = authReducer(
      undefined,
      setCredentials({ access_token: 'abc123', expires_in: 3600 }),
    );
    const state = authReducer(authenticated, logout());
    expect(state).toEqual({ token: null });
  });
});
