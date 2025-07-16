"use client"

import { useAuth, SignedIn, SignedOut } from "@/lib/mock-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Welcome to Admin Dashboard</CardTitle>
          <CardDescription>Professional admin panel with role-based access</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <SignedOut>
            <Button asChild className="w-full">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Welcome back, {user?.firstName}!</p>
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <Link href="/admin">Admin Dashboard</Link>
                </Button>
                <Button variant="outline" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </SignedIn>
        </CardContent>
      </Card>
    </div>
  )
}
