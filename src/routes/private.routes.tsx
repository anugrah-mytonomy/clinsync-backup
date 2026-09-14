import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/routes/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageLoader from '@/components/ui/PageLoader';

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const LibraryPage = lazy(() => import('@/pages/content-library/LibraryPage'));
const AddContentPage = lazy(() => import('@/pages/content-library/AddContentPage'));
const ContentLibraryPage = lazy(() => import('@/pages/content-library/ContentLibraryPage'));
// const ScansPage = lazy(() => import('@/pages/dashboard/ScansPage'));
// const FindingsReportsPage = lazy(() => import('@/pages/dashboard/FindingsReportsPage'));
const ReviewQueuePage = lazy(() => import('@/pages/dashboard/ReviewQueuePage'));
// const HelpSupportPage = lazy(() => import('@/pages/dashboard/HelpSupportPage'));
// const SettingsPage = lazy(() => import('@/pages/dashboard/SettingsPage'));

const withSuspense = (element: RouteObject['element']) => {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
};

const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: withSuspense(<DashboardPage />),
  },
  {
    path: '/library',
    element: withSuspense(<LibraryPage />),
  },
  {
    path: '/library/add-content',
    element: withSuspense(<AddContentPage />),
  },
  {
    path: '/dashboard/add-content',
    element: withSuspense(<ContentLibraryPage />),
  },
  {
    path: '/dashboard/review-queue',
    element: withSuspense(<ReviewQueuePage />),
  },
  // {
  //   path: '/dashboard/help',
  //   element: withSuspense(<HelpSupportPage />),
  // },
  // {
  //   path: '/dashboard/settings',
  //   element: withSuspense(<SettingsPage />),
  // },
];

export const privateRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: dashboardRoutes,
      },
    ],
  },
];
