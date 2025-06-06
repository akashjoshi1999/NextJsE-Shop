import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { createToken, createRefreshToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 })
    }

    await connectToDatabase()

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const token = createToken(user)
    const refreshToken = createRefreshToken(user)

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
      refreshToken,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
