'use client'

import { useEffect, useRef } from 'react'
import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'
import { selectProductList } from '@/store/slices/product/productSelectors'
import { fetchProducts } from '@/store/slices/product/productThunks'

export default function InitProductList() {
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectProductList)

  const hasFetched = useRef(false)

  useEffect(() => {
    if (products.length === 0 && !hasFetched.current) {
      hasFetched.current = true
      dispatch(fetchProducts())
    }
  }, [dispatch, products.length])

  return null
}
