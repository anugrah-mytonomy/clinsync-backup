import { describe, expect, it } from 'vitest';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { mockSession } from '@/mocks/handlers';
import { server } from '@/mocks/server';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/testing/testUtils';
import Sidebar from '@/components/layout/Sidebar';
import { setupStore } from '@/app/store';
import { setCredentials } from '@/feature/auth/authSlice';

describe('Sidebar', () => {
  it('marks the current route as active and others as inactive', () => {
    renderWithProviders(<Sidebar />, { route: '/scans' });

    expect(screen.getByRole('link', { name: /scan history/i })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current');
  });

  it('renders all primary nav links', () => {
    renderWithProviders(<Sidebar />, { route: '/dashboard' });

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Library' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Scan History' })).toBeInTheDocument();
  });

  it('renders the signed-in user', () => {
    renderWithProviders(<Sidebar />, { route: '/dashboard' });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('johndoe@mytonomy.com')).toBeInTheDocument();
  });

  it('opens the account menu and closes it from Settings or the backdrop', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Sidebar />, { route: '/dashboard' });

    await user.click(screen.getByTitle('Account'));
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      '/dashboard/settings',
    );
    await user.click(screen.getByRole('link', { name: 'Settings' }));
    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument();

    await user.click(screen.getByTitle('Account'));
    await user.click(document.querySelector('div.fixed.inset-0') as HTMLElement);
    expect(screen.queryByRole('button', { name: 'Logout' })).not.toBeInTheDocument();
  });

  it('logs out from the account menu', async () => {
    const user = userEvent.setup();
    const store = setupStore();
    store.dispatch(setCredentials({ access_token: 'mock-token', expires_in: 3600 }));
    renderWithProviders(<Sidebar />, { route: '/dashboard', store });

    await user.click(screen.getByTitle('Account'));
    await user.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => expect(store.getState().auth.token).toBeNull());
  });

  it('shows the organization logo from the session and falls back if it fails to load', async () => {
    server.use(
      http.get('*/api/v1/session', () =>
        HttpResponse.json({
          ...mockSession,
          organization: {
            ...mockSession.organization,
            config: { logo_url: 'https://cdn.example.com/logo.png' },
          },
        }),
      ),
    );
    const store = setupStore();
    store.dispatch(setCredentials({ access_token: 'mock-token', expires_in: 3600 }));
    const { container } = renderWithProviders(<Sidebar />, { route: '/dashboard', store });
    const logo = () => container.querySelector('aside img') as HTMLImageElement;

    await waitFor(() => expect(logo()).toHaveAttribute('src', 'https://cdn.example.com/logo.png'));

    fireEvent.error(logo());
    expect(logo()).not.toHaveAttribute('src', 'https://cdn.example.com/logo.png');
  });

  it('renders the brand with the organization name from the session', async () => {
    const store = setupStore();
    store.dispatch(setCredentials({ access_token: 'mock-token', expires_in: 3600 }));
    renderWithProviders(<Sidebar />, { route: '/dashboard', store });

    expect(screen.getByText('ClinSync')).toBeInTheDocument();
    expect(await screen.findByText('Mytonomy')).toBeInTheDocument();
  });
});
