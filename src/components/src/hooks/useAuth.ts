// src/hooks/useAuth.ts
import { useCallback } from 'react'
import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { selectAuthError, selectAuthLoading, selectCurrentUser, selectIsAuthenticated } from '@/store/slices/auth/authSelectors';
import { loginUser, registerUser } from '@/store/slices/auth/authThunks';
import { clearError, logOut } from '@/store/slices/auth/authSlice';
import { LoginCredentials, RegisterData } from '@/store/slices/auth/authTypes';

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectCurrentUser)
    
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const loading = useAppSelector(selectAuthLoading)
  const error = useAppSelector(selectAuthError)
  
  const login = useCallback(
    (credentials: LoginCredentials) => dispatch(loginUser(credentials)),
    [dispatch]
  )

  const register = useCallback(
    (userData: RegisterData) => dispatch(registerUser(userData)),
    [dispatch]
  )

  const logout = useCallback(() => dispatch(logOut()), [dispatch])

  const clearAuthError = useCallback(() => dispatch(clearError()), [dispatch])

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    clearError: clearAuthError,
  }
}
