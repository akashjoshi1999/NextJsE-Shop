export interface User {
    id: string
    _id?: string
    name: string
    email: string
    // etc.
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData extends LoginCredentials {
    name: string
}

export interface AuthState {
    user: User | null
    token: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
    isInitialized: boolean,
    hasFetchedUser: boolean;

    // products: [] // Adjust type as needed
}