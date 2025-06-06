import { createAsyncThunk } from '@reduxjs/toolkit'
import { Product } from './productTypes'

export const fetchProducts = createAsyncThunk<
  Product[],           // Return type
  void,                // No input param needed
  { rejectValue: string }
>('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/product') // Adjust this route
    if (!response.ok) {
      const error = await response.json()
      return rejectWithValue(error.message || 'Failed to fetch products')
    }
    const data = await response.json()
    return data
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message)
    }
    return rejectWithValue('An unknown error occurred')

  }
})
