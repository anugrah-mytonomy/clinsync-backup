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
  const [ready, setReady] = useState(() => Boolean(token));

  useEffect(() => {
    if (token) {
      setReady(true);
      return;
    }

    let cancelled = false;

    void (async () => {
      await requestRefreshToken(dispatch);
      if (!cancelled) {
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, token]);

  if (!ready) {
    return <PageLoader />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
