import { User } from '@/store/slices/auth/authTypes'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'yoursecret'
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'yourrefreshsecret'

export const createToken = (user: User) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  )
}

export const createRefreshToken = (user: User) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string }
  } catch {
    return null
  }
}