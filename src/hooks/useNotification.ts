import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import { useCallback } from 'react';
import {
  addNotification,
  removeNotification,
  clearNotifications,
  selectNotifications
} from '../store/slices/uiSlice';
import { Notification } from '@/types/ui';
import { toast } from 'react-toastify';


export const useNotification = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);

  const showNotification = useCallback(
    (notification: Notification) => {
      dispatch(addNotification(notification));

      switch (notification.type) {
        case 'success':
          toast.success(notification.message);
          break;
        case 'error':
          toast.error(notification.message);
          break;
        case 'info':
          toast.info(notification.message);
          break;
        case 'warning':
          toast.warn(notification.message);
          break;
        default:
          toast(notification.message);
      }
    },
    [dispatch]
  );

  const hideNotification = useCallback(
    (id: string) => {
      dispatch(removeNotification(id));
    },
    [dispatch]
  );

  const clearAll = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  const showSuccess = useCallback(
    (message: string, options: Partial<Notification> = {}) =>
      showNotification({
        type: 'success',
        message,
        ...options,
      }),
    [showNotification]
  );

  const showError = useCallback(
    (message: string, options: Partial<Notification> = {}) =>
      showNotification({
        type: 'error',
        message,
        duration: 8000,
        ...options,
      }),
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, options: Partial<Notification> = {}) =>
      showNotification({
        type: 'info',
        message,
        ...options,
      }),
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, options: Partial<Notification> = {}) =>
      showNotification({
        type: 'warning',
        message,
        duration: 6000,
        ...options,
      }),
    [showNotification]
  );

  return {
    notifications,
    showNotification,
    hideNotification,
    clearAll,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};
