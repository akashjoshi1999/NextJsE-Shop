import { createAsyncThunk } from '@reduxjs/toolkit'
import { LoginCredentials, RegisterData, User } from './authTypes'
import { RootState } from '@/store/index'
import { signOut } from 'next-auth/react';
import { logOut } from './authSlice';

export const loginUser = createAsyncThunk<
  { user: User; token: string; refreshToken: string },
  LoginCredentials,
  { rejectValue: string }
>('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    if (!res.ok) {
      const err = await res.json()
      return rejectWithValue(err.message)
    }

    const data = await res.json()

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token)
      localStorage.setItem('refreshToken', data.refreshToken)
    }

    return {
      user: data.user,
      token: data.token,
      refreshToken: data.refreshToken,
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('An unknown error occurred')

  }
})

export const registerUser = createAsyncThunk<void, RegisterData, { rejectValue: string }>(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      if (!res.ok) {
        const err = await res.json()
        return rejectWithValue(err.message)
      }

      await res.json()
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('An unknown error occurred')

    }
  }
)

export const fetchCurrentUser = createAsyncThunk<User, void, { state: RootState; rejectValue: string }>(
  'auth/fetchCurrentUser',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token
      if (!token) return rejectWithValue('No token found')

      const res = await fetch('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const err = await res.json()
        return rejectWithValue(err.message || 'Failed to fetch user')
      }

      const data = await res.json()
      return data.user
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('An unknown error occurred')

    }
  }
)
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/logoutUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Clear Redux state and localStorage
      dispatch(logOut())

      // Trigger NextAuth logout
      await signOut({
        redirect: false,
        callbackUrl: '/login', // optional if you want to redirect
      })
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message)
      }
      return rejectWithValue('Logout failed')
    }
  }
)