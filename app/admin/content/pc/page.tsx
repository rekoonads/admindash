"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Monitor, Plus } from "lucide-react"

export default function PCGamingPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Monitor className="h-8 w-8 text-blue-600" />
            PC Gaming Content
          </h1>
          <p className="text-muted-foreground">Manage PC gaming news, reviews, and guides</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create PC Content
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>PC News</CardTitle>
            <CardDescription>Latest PC gaming news and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">45</p>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PC Reviews</CardTitle>
            <CardDescription>Game reviews for PC platform</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">23</p>
            <p className="text-xs text-muted-foreground">Published reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>PC Guides</CardTitle>
            <CardDescription>Gaming guides and tutorials</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">18</p>
            <p className="text-xs text-muted-foreground">Published guides</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}