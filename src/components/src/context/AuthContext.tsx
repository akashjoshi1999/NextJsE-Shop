'use client'

import { createContext, ReactNode, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '@/app/Loader'
import { selectAuthLoading, selectCurrentUser, selectIsAuthenticated, selectIsInitialized } from '@/store/slices/auth/authSelectors'
import { logOut } from '@/store/slices/auth/authSlice'
import { User } from '@/store/slices/auth/authTypes'


// 1. Define the context type
interface AuthContextType {
  user: User | null// You can replace `any` with your actual user type
  isAuthenticated: boolean
  loading: boolean
  isInitialized: boolean
  logout: () => void
}

// 2. Pass the type to createContext, initially undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface Props {
  children: ReactNode
}

export function AuthProvider({ children }: Props) {
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const loading = useSelector(selectAuthLoading)
  const isInitialized = useSelector(selectIsInitialized)

  // Auto logout on token expiration
  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const currentTime = Date.now() / 1000

          if (payload.exp < currentTime) {
            dispatch(logOut())
          }
        } catch (error) {
          console.error('Token validation error:', error)
          dispatch(logOut())
        }
      }
    }
  }, [isAuthenticated, user, dispatch])

  const value: AuthContextType = {
    user,
    isAuthenticated,
    loading,
    isInitialized,
    logout: () => dispatch(logOut()),
  }

  if (loading || !isInitialized) {
    return <Loader />;
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Enforce context usage inside the provider
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
