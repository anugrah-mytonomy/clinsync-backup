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
  it('does not call refresh before login', async () => {
    let refreshCalls = 0;
    server.use(
      http.post('*/centralauth/refresh', () => {
        refreshCalls += 1;
        return HttpResponse.json({ access_token: 'mock-token', expires_in: 3600 });
      }),
    );

    const { store } = renderApp();

    expect(screen.getByText('App content')).toBeInTheDocument();
    expect(store.getState().auth.token).toBeNull();
    expect(refreshCalls).toBe(0);
  });
});
