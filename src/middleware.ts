import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 🚫 Don't apply middleware to NextAuth routes
  if (pathname.startsWith('/api/auth') && !pathname.startsWith('/api/auth/booking') && !pathname.startsWith('/api/auth/profile')) {
    return NextResponse.next()
  }

  const protectedPaths = ['/api/auth/booking', '/api/auth/profile']
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const authHeader = req.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: Missing token' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    if (!token || token.split('.').length !== 3) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token format' }, { status: 401 })
    }

    try {
      await jwtVerify(token, JWT_SECRET)
      return NextResponse.next()
    } catch (err) {
      console.error('JWT verification error:', err)
      return NextResponse.json({ message: 'Unauthorized: Invalid or expired token' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

// Match only custom protected routes
export const config = {
  matcher: ['/api/auth/booking', '/api/auth/profile', '/booking', '/profile'],
}
