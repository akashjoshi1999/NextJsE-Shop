'use client'

import { useEffect, useRef } from 'react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import {
  selectIsAuthenticated,
  selectIsInitialized,
  selectToken
} from '@/store/slices/auth/authSelectors'
import { initializeAuth } from '@/store/slices/auth/authSlice'
import { fetchCurrentUser } from '@/store/slices/auth/authThunks'

export default function InitAuthClient() {
  const dispatch = useAppDispatch()
  const isInitialized = useAppSelector(selectIsInitialized)
  const token = useAppSelector(selectToken)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const hasFetched = useRef(false)

  // Run once on mount to load token from localStorage
  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  // Conditionally fetch user (only once)
  useEffect(() => {
    if (
      isInitialized &&
      token &&
      !isAuthenticated &&
      !hasFetched.current
    ) {
      hasFetched.current = true
      dispatch(fetchCurrentUser())
    }
  }, [dispatch, isInitialized, token, isAuthenticated])

  return null
}
