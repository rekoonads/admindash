import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isApiRoute = createRouteMatcher(['/api(.*)'])

export default clerkMiddleware((auth, req) => {
  // Handle CORS for API routes
  if (isApiRoute(req)) {
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', 'https://koodos.in')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }

  // Protect admin routes
  if (isAdminRoute(req)) {
    const { protect } = auth()
    protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}