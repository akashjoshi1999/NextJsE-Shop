// src/app/layout.tsx (App Router)
import { ReactNode } from 'react'
import { ReduxProvider } from '../context/ReduxProvider'
import { AuthProvider } from '../context/AuthContext'
import './globals.css'
import RegisterModal from '@/components/register/RegisterModal'
import LoginModal from '@/components/login/LoginModal'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import InitAuthClient from '@/components/InitAuthClient'
import Navbar from '@/components/layout/Navbar'
import InitProductList from '@/components/InitProductClient'

export const metadata = {
  title: 'My Next.js Redux App',
  description: 'Built with Redux Toolkit and MongoDB',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
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
      </body>
    </html>
  )
}
