import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_EMAILS = ['azambata.1984@gmail.com'] // Add admin emails here

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/api/admin')) {
    const user = request.cookies.get('user')?.value
    
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      const userData = JSON.parse(user)
      if (!ADMIN_EMAILS.includes(userData.email)) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Protect dashboard and booking routes
  if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/api/bookings')) {
    const user = request.cookies.get('user')?.value
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/dashboard/:path*', '/api/bookings/:path*']
}
