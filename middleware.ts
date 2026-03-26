import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtDecode } from 'jwt-decode'

// JWT payload type
interface JwtPayload {
  sub?: string
  roles?: string[]
  exp?: number
  iat?: number
}

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth',
  '/auth/login',
  '/auth/register',
  '/parties',
  '/parties-list',
  '/candidates-list',
  '/results',
  '/district',
  '/api/auth/login',
  '/api/auth/register',
]

// Route to role mapping
const roleProtectedRoutes: { pattern: RegExp; requiredRole: string }[] = [
  { pattern: /^\/admin(\/.*)?$/, requiredRole: 'ROLE_ADMIN' },
  { pattern: /^\/ec(\/.*)?$/, requiredRole: 'ROLE_EC' },
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (
    publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + '/'),
    )
  ) {
    return NextResponse.next()
  }

  // Skip middleware for static files, api routes, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next()
  }

  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Decode token to check roles
  try {
    const decoded = jwtDecode<JwtPayload>(token)

    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    // Get user roles from token
    const userRoles = decoded.roles || []

    // Check role-based access for protected routes
    for (const { pattern, requiredRole } of roleProtectedRoutes) {
      if (pattern.test(pathname)) {
        if (!userRoles.includes(requiredRole)) {
          // User doesn't have required role, redirect to appropriate portal
          if (userRoles.includes('ROLE_ADMIN')) {
            return NextResponse.redirect(
              new URL('/admin/constituencies', request.url),
            )
          } else if (userRoles.includes('ROLE_EC')) {
            return NextResponse.redirect(new URL('/ec/parties', request.url))
          } else {
            // No valid role, go to voter portal
            return NextResponse.redirect(new URL('/vote', request.url))
          }
        }
        break
      }
    }
  } catch (error) {
    // Invalid token, redirect to login
    console.error('Middleware: Invalid token', error)
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
