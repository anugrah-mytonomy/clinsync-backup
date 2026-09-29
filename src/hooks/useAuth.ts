import { skipToken } from '@reduxjs/toolkit/query/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '@/app/store';
import { logout, selectToken } from '@/feature/auth/authSlice';
import { useGetSessionQuery, useLogoutMutation } from '@/feature/auth/authApiSlice';
import type { PermissionAction, PermissionMenu, Session } from '@/feature/auth/authApiSlice.types';

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

// GET /api/v1/session for the current token (skipped while there is no token).
export function useSession() {
  const token = useSelector(selectToken);
  return useGetSessionQuery(token ?? skipToken);
}

export function useOrganization(): Session['organization'] | undefined {
  return useSession().data?.organization;
}

// 'modify' implies 'read'; every other action must be granted explicitly.
export function hasPermission(
  permissions: Session['permissions'] | undefined,
  menu: PermissionMenu,
  action: PermissionAction,
) {
  const granted = permissions?.[menu] ?? [];
  if (action === 'read') return granted.includes('read') || granted.includes('modify');
  return granted.includes(action);
}

export function useHasPermission(menu: PermissionMenu, action: PermissionAction) {
  return hasPermission(useSession().data?.permissions, menu, action);
}
