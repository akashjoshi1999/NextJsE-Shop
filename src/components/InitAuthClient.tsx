'use client'

import { useEffect, useRef } from 'react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { useSession } from 'next-auth/react'

import {
  selectIsAuthenticated,
  selectIsInitialized,
  selectToken
} from '@/store/slices/auth/authSelectors'
import { initializeAuth, setUser } from '@/store/slices/auth/authSlice'
import { fetchCurrentUser } from '@/store/slices/auth/authThunks'

export default function InitAuthClient() {
  const dispatch = useAppDispatch()
  const isInitialized = useAppSelector(selectIsInitialized)
  const token = useAppSelector(selectToken)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const hasFetchedUser = useAppSelector(state => state.auth.hasFetchedUser)

  const { data: session, status } = useSession()
  const hasFetched = useRef(false)

  // Normal login - load token from localStorage
  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  // Fetch user from token-based login
  useEffect(() => {
    if (
      isInitialized &&
      token &&
      !isAuthenticated &&
      !hasFetched.current &&
      !hasFetchedUser
    ) {
      hasFetched.current = true
      dispatch(fetchCurrentUser())
    }
  }, [dispatch, isInitialized, token, isAuthenticated, hasFetchedUser])

  // OAuth login - hydrate user from NextAuth session
  useEffect(() => {
    if (status === 'authenticated' && session?.user && !isAuthenticated) {
  dispatch(setUser({
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    token: (session as any).accessToken,
    refreshToken: (session as any).refreshToken
  }));
}

  }, [status, session, dispatch, isAuthenticated])

  return null
}
