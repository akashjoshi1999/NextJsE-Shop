import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product, ProductState } from './productTypes'
import { fetchProducts } from './productThunks'

const initialState: ProductState = {
  productList: [],
  loading: false,
  error: null,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProduct(state, action: PayloadAction<Product>) {
      state.productList.push(action.payload)
    },
    removeProduct(state, action: PayloadAction<string>) {
      state.productList = state.productList.filter(p => p.handle !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.productList = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Could not fetch products'
      })
  },
})

export const { addProduct, removeProduct } = productSlice.actions
export default productSlice.reducer
