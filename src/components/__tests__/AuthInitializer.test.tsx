import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { Provider } from 'react-redux';
import { setupStore } from '@/app/store';
import AuthInitializer from '@/components/AuthInitializer';
import { server } from '@/mocks/server';

const renderApp = () => {
  const store = setupStore();
  render(
    <Provider store={store}>
      <AuthInitializer>
        <div>App content</div>
      </AuthInitializer>
    </Provider>,
  );
  return { store };
};

describe('AuthInitializer', () => {
  it('restores the access token from the refresh cookie on app start', async () => {
    server.use(
      http.post('*/centralauth/refresh', () =>
        HttpResponse.json({ access_token: 'mock-token', expires_in: 3600 }),
      ),
    );

    const { store } = renderApp();

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(await screen.findByText('App content')).toBeInTheDocument();
    expect(store.getState().auth.token).toBe('mock-token');
  });

  it('renders the app logged out when there is no refresh cookie', async () => {
    const { store } = renderApp();

    expect(await screen.findByText('App content')).toBeInTheDocument();
    expect(store.getState().auth.token).toBeNull();
  });
});
