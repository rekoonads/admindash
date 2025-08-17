"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  
  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) {
        router.replace("/admin")
      } else {
        router.replace("/sign-in")
      }
    }
  }, [isSignedIn, isLoaded, router])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return null
}