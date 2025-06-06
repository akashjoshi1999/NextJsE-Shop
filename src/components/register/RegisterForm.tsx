'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useNotification } from '../../hooks/useNotification'
import { useModal } from '../../hooks/useModal'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function RegisterForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const { register, loading } = useAuth()
  const { showSuccess, showError } = useNotification()
  const { close } = useModal('loginModal')
  const { open: openLoginModal } = useModal('loginModal')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { email, password, confirmPassword, name } = formData

    if (!email || !password || !confirmPassword || !name) {
      return showError('All fields are required.')
    }

    if (password !== confirmPassword) {
      return showError('Passwords do not match.')
    }

    try {
      const result = await register({ name, email, password })

      if (result.type === 'auth/loginUser/fulfilled') {
        showSuccess('Login successful!')
        close()
        setFormData({ name: '', email: '', password: '', confirmPassword: '' })
      } else {
        showError('Registration failed. Please try again.')
      }
    } catch (err) {
      console.error('Registration error:', err)
      showError('Something went wrong. Please try again.')
    }
  }

  const handleLoginModel = () => {
    close()
    openLoginModal()
  }
  return (
    <div className="px-6 py-8 sm:px-8 sm:py-10">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
        <p className="text-sm text-gray-500 mt-1">Fill in the information below</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-gray-600 dark:text-gray-300">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-800 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
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
            id="password"
            name="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-800 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-800 px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 sm:text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>


      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            onClick={handleLoginModel}
            className="text-indigo-600 hover:text-indigo-500 font-medium transition"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  )
}
