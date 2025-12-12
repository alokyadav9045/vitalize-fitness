import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  // Define protected routes
  const protectedPaths = [
    '/admin',
    '/api/attendance',
    '/api/dashboard',
    '/api/fees',
    '/api/gallery',
    '/api/members',
    '/api/partners',
    '/api/plans',
    '/api/settings',
    '/api/testimonials',
    '/api/trainers',
    '/api/upload'
  ]

  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.startsWith(path)
  )

  // Allow login page and auth API
  if (request.nextUrl.pathname === '/admin/login' ||
      request.nextUrl.pathname === '/api/auth/login') {
    return NextResponse.next()
  }

  if (isProtectedPath) {
    const token = request.cookies.get('adminToken')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      // For API routes, return 401
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, message: 'Authentication required' },
          { status: 401 }
        )
      }
      // For page routes, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      // For API routes, return 401
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired token' },
          { status: 401 }
        )
      }
      // For page routes, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Add user info to headers for API routes
    const response = NextResponse.next()
    response.headers.set('x-user-role', decoded.role)
    response.headers.set('x-user-username', decoded.username)

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*'
  ]
}