"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  firstName: string
  lastName: string
  primaryEmailAddress: { emailAddress: string }
}

interface Organization {
  id: string
  name: string
}

interface AuthContextType {
  user: User | null
  organization: Organization | null
  isSignedIn: boolean
  orgRole: string | null
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [organization] = useState<Organization>({
    id: "org_123",
    name: "Acme Corporation",
  })
  const [orgRole, setOrgRole] = useState<string | null>(null)

  useEffect(() => {
    // Check if user was previously signed in
    const savedUser = localStorage.getItem("mock-user")
    const savedRole = localStorage.getItem("mock-role")

    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser))
      setOrgRole(savedRole)
    }

    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call Clerk
    if (email === "admin@example.com" && password === "admin123") {
      const mockUser = {
        id: "user_123",
        firstName: "John",
        lastName: "Admin",
        primaryEmailAddress: { emailAddress: email },
      }
      setUser(mockUser)
      setOrgRole("org:admin")
      localStorage.setItem("mock-user", JSON.stringify(mockUser))
      localStorage.setItem("mock-role", "org:admin")
      return true
    } else if (email === "user@example.com" && password === "user123") {
      const mockUser = {
        id: "user_456",
        firstName: "Jane",
        lastName: "User",
        primaryEmailAddress: { emailAddress: email },
      }
      setUser(mockUser)
      setOrgRole("org:member")
      localStorage.setItem("mock-user", JSON.stringify(mockUser))
      localStorage.setItem("mock-role", "org:member")
      return true
    }
    return false
  }

  const signOut = () => {
    setUser(null)
    setOrgRole(null)
    localStorage.removeItem("mock-user")
    localStorage.removeItem("mock-role")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        isSignedIn: !!user,
        orgRole,
        signIn,
        signOut,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

// Mock components to replace Clerk components
export function SignedIn({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth()
  return isSignedIn ? <>{children}</> : null
}

export function SignedOut({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useAuth()
  return !isSignedIn ? <>{children}</> : null
}
