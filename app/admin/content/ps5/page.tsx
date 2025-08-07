"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad2, Plus } from "lucide-react"

export default function PS5Page() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-blue-600" />
            PlayStation 5 Content
          </h1>
          <p className="text-muted-foreground">Manage PS5 gaming content and exclusives</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create PS5 Content
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>PS5 News</CardTitle>
            <CardDescription>PlayStation 5 news and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">32</p>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PS5 Reviews</CardTitle>
            <CardDescription>Exclusive and multiplatform reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">19</p>
            <p className="text-xs text-muted-foreground">Published reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PS5 Guides</CardTitle>
            <CardDescription>PlayStation 5 gaming guides</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">14</p>
            <p className="text-xs text-muted-foreground">Published guides</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}