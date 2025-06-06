// src/store/slices/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'
import {
  UIState,
  Notification,
  PageState,
  Theme,
} from '@/types/ui'

const initialState: UIState = {
  theme: 'light',
  globalLoading: false,
  modals: {
    loginModal: false,
    registerModal: false,
    confirmModal: false,
  },
  sidebarOpen: false,
  notifications: [],
  forms: {
    login: {
      showPassword: false,
    },
    register: {
      showPassword: false,
      showConfirmPassword: false,
    },
  },
  pages: {
    users: {
      currentPage: 1,
      pageSize: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      filters: {},
    },
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme actions
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },

    // Loading
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload
    },

    // Modals
    openModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = true
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = false
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((modal) => {
        state.modals[modal] = false
      })
    },

    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },

    // Notifications
    addNotification: (state, action: PayloadAction<Partial<Notification>>) => {
      const notification: Notification = {
        id: nanoid(),
        type: 'info',
        duration: 5000,
        ...action.payload,
      } as Notification
      state.notifications.push(notification)
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },

    // Form fields
    toggleFormField: (
      state,
      action: PayloadAction<{ form: keyof UIState['forms']; field: string }>
    ) => {
      const { form, field } = action.payload
      if (state.forms[form] && field in state.forms[form]) {
        state.forms[form][field] = !state.forms[form][field]
      }
    },

    // Pages
    setPageState: (
      state,
      action: PayloadAction<{ page: string; data: Partial<PageState> }>
    ) => {
      const { page, data } = action.payload
      if (state.pages[page]) {
        state.pages[page] = { ...state.pages[page], ...data }
      }
    },
    resetPageState: (state, action: PayloadAction<string>) => {
      const page = action.payload
      if (state.pages[page]) {
        state.pages[page] = initialState.pages[page]
      }
    },
  },
})

export const {
  toggleTheme,
  setTheme,
  setGlobalLoading,
  openModal,
  closeModal,
  closeAllModals,
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  clearNotifications,
  toggleFormField,
  setPageState,
  resetPageState,
} = uiSlice.actions

export default uiSlice.reducer

// Selectors
import { RootState } from '@/store/index' // adjust based on your store file

export const selectTheme = (state: RootState) => state.ui.theme
export const selectGlobalLoading = (state: RootState) => state.ui.globalLoading
export const selectModalState = (modalName: string) => (state: RootState) =>
  state.ui.modals[modalName]
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen
export const selectNotifications = (state: RootState) => state.ui.notifications
export const selectFormState = (formName: keyof UIState['forms']) => (state: RootState) =>
  state.ui.forms[formName]
export const selectPageState = (pageName: string) => (state: RootState) =>
  state.ui.pages[pageName]
