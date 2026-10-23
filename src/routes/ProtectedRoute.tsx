import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { requestRefreshToken } from '@/app/api/apiSlice';
import type { AppDispatch } from '@/app/store';
import { selectToken } from '@/feature/auth/authSlice';
import PageLoader from '@/components/ui/PageLoader';

const ProtectedRoute = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectToken);
  // After reload, token is empty until refresh runs; do not tie this flag to `token` in effect deps
  // or a successful refresh sets token before setBootstrapped and leaves the loader stuck forever.
  const [bootstrapped, setBootstrapped] = useState(() => Boolean(token));

  useEffect(() => {
    if (token) {
      return;
    }

    let cancelled = false;

    void (async () => {
      await requestRefreshToken(dispatch);
      if (!cancelled) {
        setBootstrapped(true);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run refresh once per mount when token was empty; re-running when token updates cancels setBootstrapped.
  }, [dispatch]);

  if (!token) {
    if (!bootstrapped) {
      return <PageLoader />;
    }
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
