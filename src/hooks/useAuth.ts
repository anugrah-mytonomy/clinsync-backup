import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '@/app/store';
import { logout, selectToken } from '@/feature/auth/authSlice';
import { useLogoutMutation } from '@/feature/auth/authApiSlice';

export function useAuth() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();
  const token = useSelector(selectToken);

  const signOut = async () => {
    try {
      navigate('/login');
      await logoutMutation().unwrap();
    } finally {
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  };

  return {
    token,
    isAuthenticated: Boolean(token),
    logout: signOut,
    isLoggingOut,
  };
}
