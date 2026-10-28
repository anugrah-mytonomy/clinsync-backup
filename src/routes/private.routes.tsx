import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/routes/ProtectedRoute';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageLoader from '@/components/ui/PageLoader';
import DashboardPage from '@/pages/dashboard/DashboardPage';

const LibraryPage = lazy(() => import('@/pages/content-library/LibraryPage'));
const AddContentPage = lazy(() => import('@/pages/content-library/AddContentPage'));
const ScanHistoryPage = lazy(() => import('@/pages/scan-history/ScanHistoryPage'));
const ScanResultsPage = lazy(() => import('@/pages/scan-history/ScanResultsPage'));
const DocumentDetailsPage = lazy(() => import('@/pages/scan-history/DocumentDetailsPage'));
const ReplaceDocumentPage = lazy(() => import('@/pages/scan-history/ReplaceDocumentPage'));
// const FindingsReportsPage = lazy(() => import('@/pages/dashboard/FindingsReportsPage'));
const ReviewQueuePage = lazy(() => import('@/pages/dashboard/ReviewQueuePage'));
const HelpSupportPage = lazy(() => import('@/pages/help-support/HelpSupportPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));

const withSuspense = (element: RouteObject['element']) => {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
};

const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    element: <DashboardPage />,
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
    path: '/dashboard/review-queue',
    element: withSuspense(<ReviewQueuePage />),
  },
  {
    path: '/scans',
    element: withSuspense(<ScanHistoryPage />),
  },
  {
    path: '/scans/:scanId',
    element: withSuspense(<ScanResultsPage />),
  },
  {
    path: '/scans/:scanId/documents/:documentId',
    element: withSuspense(<DocumentDetailsPage />),
  },
  {
    path: '/scans/:scanId/documents/:documentId/replace',
    element: withSuspense(<ReplaceDocumentPage />),
  },
  {
    path: '/help',
    element: withSuspense(<HelpSupportPage />),
  },
  {
    path: '/settings',
    element: withSuspense(<SettingsPage />),
  },
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
