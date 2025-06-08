import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { getToken } from 'next-auth/jwt';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);
const NEXTAUTH_SECRET = process.env.AUTH_SECRET;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip public or NextAuth routes (except protected booking/profile)
  if (
    pathname.startsWith('/api/auth') &&
    !pathname.startsWith('/api/auth/booking') &&
    !pathname.startsWith('/api/auth/profile')
  ) {
    return NextResponse.next();
  }

  const protectedPaths = ['/api/auth/booking', '/api/auth/profile', '/booking', '/profile'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected) {
    const authHeader = req.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    // ✅ Try custom JWT first
    if (bearerToken) {
      try {
        await jwtVerify(bearerToken, JWT_SECRET);
        return NextResponse.next();
      } catch (err) {
        console.error('JWT verification failed:', err);
      }
    }

    // ✅ Fallback to OAuth (NextAuth) session token from cookies
    const token = await getToken({ req, secret: NEXTAUTH_SECRET });
    if (token?.email) {
      return NextResponse.next();
    }

    // ❌ If neither method authenticates
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/booking', '/api/auth/profile', '/booking', '/profile'],
};
