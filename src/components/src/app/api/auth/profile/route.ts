import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]

    // Verify token
    const decoded = verifyToken(token) // Assumes decoded contains user ID
    if (!decoded?.id) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    await connectToDatabase()

    const user = await User.findById(decoded.id).select('name email') // Exclude password

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth check failed:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
