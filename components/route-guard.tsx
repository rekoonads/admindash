"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "./loading-spinner"

interface RouteGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function RouteGuard({ children, requireAdmin = false }: RouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [authUser, setAuthUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for authentication
    const user = localStorage.getItem('auth-user')
    if (user) {
      setAuthUser(JSON.parse(user))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isLoading) return

    // Don't redirect if we're already on the sign-in page
    if (pathname === "/sign-in") {
      return
    }

    // If user is not signed in, redirect to sign-in
    if (!authUser) {
      router.push("/sign-in")
      return
    }

    // For demo purposes, assume all authenticated users are admins
    // In a real app, you'd check user roles from the auth system
    if (requireAdmin && !authUser) {
      router.push("/unauthorized")
      return
    }
  }, [authUser, requireAdmin, router, pathname, isLoading])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!authUser && pathname !== "/sign-in") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner className="mx-auto mb-4" />
          <p>Redirecting to sign in...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
