import { useEffect, useState, type ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/app/store';
import { selectToken, setCredentials } from '@/feature/auth/authSlice';
import { useRefreshMutation } from '@/feature/auth/authApiSlice';
import PageLoader from '@/components/ui/PageLoader';

const AuthInitializer = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectToken);
  const [refresh] = useRefreshMutation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!token) {
        try {
          const result = await refresh().unwrap();
          dispatch(setCredentials(result));
        } catch {
          // No session cookie exists yet.
        }
      }

      setIsLoading(false);
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return <>{children}</>;
};

export default AuthInitializer;
