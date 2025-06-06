import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Base query with auth token injection
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

// Base query with re-auth logic
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    // Try to get a new token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)
    
    if (refreshResult.data) {
      api.dispatch(authSlice.actions.setCredentials(refreshResult.data))
      result = await baseQuery(args, api, extraOptions)
    } else {
      api.dispatch(authSlice.actions.logOut())
    }
  }
  
  return result
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Post', 'Auth'],
  endpoints: () => ({}),
})