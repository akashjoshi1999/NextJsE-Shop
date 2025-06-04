export type Theme = 'light' | 'dark'

export interface Notification {
  id?: string
  type?: 'info' | 'success' | 'error' | 'warning'
  message: string
  duration?: number,
  [key: string]: unknown;  // safer than any
}

export interface FormState {
  [field: string]: boolean
}

export interface UIForms {
  login: FormState
  register: FormState
}

export interface ModalState {
  [modalName: string]: boolean
}

export interface PageState {
  currentPage: number
  pageSize: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
  filters: Record<string, unknown>  // safer than any
}

export interface UIPages {
  [pageName: string]: PageState
}

export interface UIState {
  theme: Theme
  globalLoading: boolean
  modals: ModalState
  sidebarOpen: boolean
  notifications: Notification[]
  forms: UIForms
  pages: UIPages
}
