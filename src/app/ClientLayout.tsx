// src/app/ClientLayout.tsx
'use client'

import { ReactNode } from 'react'
import { ReduxProvider } from '../context/ReduxProvider'
import { AuthProvider } from '../context/AuthContext'
import { SessionProvider } from 'next-auth/react'
import RegisterModal from '@/components/register/RegisterModal'
import LoginModal from '@/components/login/LoginModal'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import InitAuthClient from '@/components/InitAuthClient'
import Navbar from '@/components/layout/Navbar'
import InitProductList from '@/components/InitProductClient'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider>
        <AuthProvider>
          <Navbar />
          <InitProductList />
          <InitAuthClient />
          <RegisterModal />
          <LoginModal />
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthProvider>
      </ReduxProvider>
    </SessionProvider>
  )
}
