import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isApiRoute = createRouteMatcher(['/api(.*)'])
const isSignInRoute = createRouteMatcher(['/sign-in(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Handle CORS for API routes
  if (isApiRoute(req)) {
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', 'https://koodos.in')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }

  const authResult = await auth()
  
  // If user is authenticated and on sign-in page, redirect to admin
  if (authResult.userId && isSignInRoute(req)) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  // Protect admin routes
  if (isAdminRoute(req) && !authResult.userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
}