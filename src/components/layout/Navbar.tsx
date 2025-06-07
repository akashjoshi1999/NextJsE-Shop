'use client'

import { Suspense } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Profile from './Profile'
import { useModal } from '@/hooks/useModal'
import Search, { SearchSkeleton } from './search'
import LogoSquare from '../logo-square'
import Link from 'next/link'

const menu = [
  { title: 'Product', path: '#' },
  { title: 'Features', path: '#' },
  { title: 'Marketplace', path: '#' },
  { title: 'Company', path: '#' },
]

export default function Navbar() {
  const { isAuthenticated } = useAuth()
  const { open: openLoginModal } = useModal('loginModal')
  const { open: openRegisterModal } = useModal('registerModal')

  return (
    <nav className="relative z-50 bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800/50 shadow-md sticky top-0">
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-800/80 via-neutral-900/90 to-neutral-800/80 blur-sm"></div>

      <div className="relative flex items-center justify-between px-4 py-3 lg:px-8">
        {/* Left Section: Logo + Menu */}
        <div className="flex w-full items-center md:w-1/3">
          <Link
            href="/"
            className="flex items-center gap-2 text-white group hover:scale-105 transition-transform duration-300"
          >
            <div className="relative">
              <LogoSquare />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-lg"></div>
            </div>
            <span className="text-lg font-bold uppercase tracking-wider hidden lg:block text-white group-hover:text-indigo-300 transition-colors">
              WebU
            </span>
          </Link>

          <ul className="hidden md:flex gap-6 ml-8">
            {menu.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  className="text-sm text-neutral-400 hover:text-white font-medium transition-colors duration-200 relative group"
                >
                  {item.title}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Center Section: Search */}
        <div className="hidden md:flex justify-center md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <div className="relative w-full max-w-md">
              <Search />
              <div className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
            </div>
          </Suspense>
        </div>

        {/* Right Section: Auth / Profile */}
        <div className="hidden lg:flex lg:flex-1 justify-end items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <Profile />
            </div>
          ) : (
            <>
              <button
                onClick={openLoginModal}
                className="px-4 py-2 text-sm font-medium text-neutral-300 hover:text-white border border-neutral-700 rounded-lg transition-all duration-300 hover:bg-neutral-800"
              >
                Login
              </button>
              <button
                onClick={openRegisterModal}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-xl"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Line Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
    </nav>
  )
}
