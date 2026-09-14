import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/testing/testUtils';
import Sidebar from '@/components/layout/Sidebar';

describe('Sidebar', () => {
  it('marks the current route as active and others as inactive', () => {
    renderWithProviders(<Sidebar />, { route: '/dashboard/scans' });

    expect(screen.getByRole('link', { name: /scan history/i })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current');
  });

  it('renders all primary nav links', () => {
    renderWithProviders(<Sidebar />, { route: '/dashboard' });

    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(screen.getByRole('link', { name: 'Library' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Scan History' })).toBeInTheDocument();
  });

  it('renders the signed-in user', () => {
    renderWithProviders(<Sidebar />, { route: '/dashboard' });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('johndoe@mytonomy.com')).toBeInTheDocument();
  });

  it('renders the brand', () => {
    renderWithProviders(<Sidebar />, { route: '/dashboard' });

    expect(screen.getByText('ClinSync')).toBeInTheDocument();
    expect(screen.getByText('Mytonomy')).toBeInTheDocument();
  });
});
