import { RootState } from '@/store/index' 

export const selectProductList = (state: RootState) => state.products.productList ?? [];
