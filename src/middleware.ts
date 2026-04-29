import { createServerClient, type NextRequest } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Mini-WAF: Block common attack patterns in URL
  const suspiciousPatterns = ['<script', 'javascript:', 'union select', 'drop table', '1=1', '--']
  const url = request.nextUrl.pathname.toLowerCase()
  if (suspiciousPatterns.some(p => url.includes(p))) {
    return new NextResponse('Access Denied: Security Policy', { status: 403 })
  }

  // Protect Dashboard & Admin routes
  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') || 
                          request.nextUrl.pathname.startsWith('/submit') || 
                          request.nextUrl.pathname.startsWith('/admin')

  if (!user && isProtectedPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin access check (Extra Security)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const isMaster = user?.email === 'miansabmi7@gmail.com';
    const isAdminRole = user?.app_metadata?.role === 'admin' || user?.user_metadata?.role === 'admin';
    
    if (!isMaster && !isAdminRole) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/submit/:path*', '/login', '/signup'],
}
