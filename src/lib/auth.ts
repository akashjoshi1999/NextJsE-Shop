import { User } from '@/store/slices/auth/authTypes'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'yourrefreshsecret'

export const createToken = (user: User) => {
  const id = (user as User)._id || user.id // ✅ safer fallback
  return jwt.sign(
    { id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  )
}

export const createRefreshToken = (user: User) => {
  const id = (user as User)._id || user.id
  return jwt.sign(
    { id, email: user.email },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string }
  } catch (err) {
    console.error('JWT verification error:', err)
    return null
  }
}
