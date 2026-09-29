import { http, HttpResponse } from 'msw';
import type { ClinsyncApiError, Session } from '@/feature/auth/authApiSlice.types';

export const mockSession: Session = {
  user: { userId: 1, roles: ['admin'] },
  organization: { organizationId: 'org-1', name: 'Mytonomy', config: {} },
  permissions: { DA: ['read'], LB: ['read', 'upload'], SH: ['modify'] },
  tokenExpiresAt: '2030-01-01T00:00:00Z',
};

const apiError = (code: string, message: string): ClinsyncApiError => ({
  error: { code, message, details: [], request_id: 'req-test' },
});

// GET /api/v1/session responses, keyed by the Bearer token the test puts in the store.
const sessionErrors: Record<string, { status: number; body: ClinsyncApiError }> = {
  'expired-token': { status: 401, body: apiError('token_expired', 'Token has expired') },
  'invalid-token': { status: 401, body: apiError('invalid_token', 'Token is invalid') },
  'no-org-token': {
    status: 403,
    body: apiError('no_organization', 'Your account is not linked to an organization.'),
  },
  'inactive-org-token': {
    status: 403,
    body: apiError('organization_inactive', 'Your organization is inactive.'),
  },
  'no-access-token': {
    status: 403,
    body: apiError('no_access', 'You do not have access to ClinSync.'),
  },
  'server-error-token': {
    status: 500,
    body: apiError('internal_error', 'Unexpected server error'),
  },
};

export const handlers = [
  http.post('*/centralauth/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };

    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        access_token: 'mock-token',
        expires_in: 3600,
      });
    }

    return HttpResponse.json({ detail: 'Invalid email or password' }, { status: 401 });
  }),

  http.post('*/centralauth/refresh', () =>
    HttpResponse.json({ detail: 'No session' }, { status: 401 }),
  ),

  http.post('*/centralauth/logout', () => HttpResponse.json(null, { status: 200 })),

  http.get('*/api/v1/session', ({ request }) => {
    const token = request.headers.get('Authorization')?.replace(/^Bearer /, '') ?? '';
    const sessionError = sessionErrors[token];

    if (sessionError) {
      return HttpResponse.json(sessionError.body, { status: sessionError.status });
    }

    if (token !== 'mock-token') {
      return HttpResponse.json(apiError('invalid_token', 'Token is invalid'), { status: 401 });
    }

    return HttpResponse.json(mockSession);
  }),
];
