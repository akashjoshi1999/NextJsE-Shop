// src/hooks/useAppSelector.ts
import { useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState } from '../store'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector