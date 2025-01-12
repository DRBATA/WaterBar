import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verify, JwtPayload } from 'jsonwebtoken'

interface UserJwtPayload extends JwtPayload {
  id: string
  email: string
  role: 'USER' | 'STAFF'
  emailVerified: boolean
}

// Define protected routes
const protectedRoutes = ['/dashboard']
const adminRoutes = ['/admin']
const authRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Function to verify JWT token
  const verifyToken = (): UserJwtPayload | null => {
    try {
      return token ? verify(token, process.env.JWT_SECRET!) as UserJwtPayload : null
    } catch {
      return null
    }
  }

  // Get user from token
  const user = verifyToken()

  // Redirect authenticated users away from auth pages
  if (user && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Check protected routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Check email verification
    if (!user.emailVerified) {
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent('Please verify your email')}`, request.url)
      )
    }
  }

  // Check admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    if (user.role !== 'STAFF') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
}
