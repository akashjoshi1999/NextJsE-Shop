export interface User {
    id: string
    _id?: string
    name: string
    email: string
    first_name?: string,
    last_name?: string,
    phone?: string,
    bio?: string,
    location?: string,
    profileImage?: string // URL or path to the user's profile image
    image?: string // Optional, used in OAuth flows
    token?: string // Optional, used in OAuth flows
    refreshToken?: string // Optional, used in OAuth flows
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