'use client'

import { Provider } from 'react-redux'
import { store } from '../store'
import { useEffect, ReactNode } from 'react'
import { useDispatch } from 'react-redux'
import { initializeAuth } from '../store/slices/auth/authSlice'

interface Props {
  children: ReactNode
}

// Auth initialization component
function AuthInitializer({ children }: Props) {
  const dispatch = useDispatch()

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth())
  }, [dispatch])

  return children
}

export function ReduxProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
      </AuthInitializer>
    </Provider>
  )
}
