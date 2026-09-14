import { http, HttpResponse } from 'msw';

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

  http.post('*/centralauth/refresh', () => HttpResponse.json({ detail: 'No session' }, { status: 401 })),

  http.post('*/centralauth/logout', () => HttpResponse.json(null, { status: 200 })),
];
