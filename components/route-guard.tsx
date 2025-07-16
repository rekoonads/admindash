"use client"

import type React from "react"
import { useAuth } from "@/lib/mock-auth"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

interface RouteGuardProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function RouteGuard({ children, requireAdmin = false }: RouteGuardProps) {
  const { user, orgRole, isSignedIn } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Don't redirect if we're already on the sign-in page
    if (pathname === "/sign-in") {
      return
    }

    // If user is not signed in, redirect to sign-in
    if (!isSignedIn) {
      router.push("/sign-in")
      return
    }

    // If admin is required but user is not admin, redirect to unauthorized
    if (requireAdmin && orgRole !== "org:admin") {
      router.push("/unauthorized")
      return
    }
  }, [isSignedIn, orgRole, requireAdmin, router, pathname])

  // Show loading while checking authentication
  if (!isSignedIn && pathname !== "/sign-in") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Show loading while checking admin permissions
  if (requireAdmin && orgRole !== "org:admin" && pathname !== "/unauthorized") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Checking permissions...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
