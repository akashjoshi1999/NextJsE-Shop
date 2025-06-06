'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNotification } from '../../hooks/useNotification'
import { useModal } from '../../hooks/useModal'

interface LoginFormData {
  email: string
  password: string
}

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })

  const { login, loading } = useAuth()
  const { showSuccess, showError } = useNotification()
  const { close } = useModal('loginModal')
  const { open: openRegisterModal } = useModal('registerModal')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { email, password } = formData

    if (!email || !password) {
      return showError('Both email and password are required.')
    }

    try {
      const result = await login({ email, password })

      if (result?.type === 'auth/loginUser/fulfilled') {
        showSuccess('Login successful!')
        close()
        setFormData({ email: '', password: '' })
      } else {
        console.log(result);

        showError('Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      showError('Something went wrong. Please try again.')
    }
  }
  const handleRegisterModal = () => {
    close()
    openRegisterModal()
  }
  return (
    <div className="px-6 py-8 sm:px-8 sm:py-10">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Login to Your Account</h2>
        <p className="text-sm text-gray-500 mt-1">Enter your credentials below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-800 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-800 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:border-primary-200 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          Don’t have an account?{' '}
          <button
            type="button"
            onClick={handleRegisterModal}
            className="text-indigo-600 hover:text-indigo-500 font-medium transition"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  )
}
