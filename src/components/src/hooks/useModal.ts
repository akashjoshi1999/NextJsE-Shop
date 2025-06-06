
// src/hooks/useModal.ts
import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { 
  openModal, 
  closeModal, 
  closeAllModals,
  selectModalState 
} from '../store/slices/uiSlice'

export const useModal = (modalName : string) => {
  const dispatch = useDispatch()
  const isOpen = useSelector(selectModalState(modalName))

  const open = useCallback(() => {
    dispatch(closeAllModals())
    dispatch(openModal(modalName))
  }, [dispatch, modalName])

  const close = useCallback(
    () => dispatch(closeModal(modalName)),
    [dispatch, modalName]
  )

  const toggle = useCallback(
    () => {
      if (isOpen) {
        close()
      } else {
        open()
      }
    },
    [isOpen, open, close]
  )

  return {
    isOpen,
    open,
    close,
    toggle,
  }
}
