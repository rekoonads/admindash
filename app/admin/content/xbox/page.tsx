"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad2, Plus } from "lucide-react"

export default function XboxPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-green-600" />
            Xbox Content
          </h1>
          <p className="text-muted-foreground">Manage Xbox gaming content and Game Pass</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Xbox Content
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Xbox News</CardTitle>
            <CardDescription>Xbox and Game Pass updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">28</p>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Xbox Reviews</CardTitle>
            <CardDescription>Xbox exclusive reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">15</p>
            <p className="text-xs text-muted-foreground">Published reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Xbox Guides</CardTitle>
            <CardDescription>Xbox gaming guides</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Published guides</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}