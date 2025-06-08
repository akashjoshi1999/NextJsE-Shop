// src/app/layout.tsx
import { ReactNode } from 'react'
import './globals.css'
import ClientLayout from './ClientLayout'


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
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
