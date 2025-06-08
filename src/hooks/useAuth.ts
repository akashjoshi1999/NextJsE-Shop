// src/hooks/useAuth.ts
import { useCallback } from 'react'
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { selectAuthError, selectAuthLoading, selectCurrentUser, selectIsAuthenticated, selectToken } from '@/store/slices/auth/authSelectors';
import { loginUser, logoutUser, registerUser } from '@/store/slices/auth/authThunks';
import { clearError, logOut } from '@/store/slices/auth/authSlice';
import { LoginCredentials, RegisterData } from '@/store/slices/auth/authTypes';

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
    
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const loading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectAuthError)
  const token = useAppSelector(selectToken);
  const login = useCallback(
    (credentials: LoginCredentials) => dispatch(loginUser(credentials)),
    [dispatch]
  )

  const register = useCallback(
    (userData: RegisterData) => dispatch(registerUser(userData)),
    [dispatch]
  )

  const logout = useCallback(() => dispatch(logoutUser()), [dispatch])

  const clearAuthError = useCallback(() => dispatch(clearError()), [dispatch])

  return {
    user,
    isAuthenticated,
    loading,
    error,
    token,
    login,
    register,
    logout,
    clearError: clearAuthError,
  }
}
