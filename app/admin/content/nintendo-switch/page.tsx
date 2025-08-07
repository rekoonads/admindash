"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad2, Plus } from "lucide-react"

export default function NintendoSwitchPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-red-600" />
            Nintendo Switch Content
          </h1>
          <p className="text-muted-foreground">Manage Nintendo Switch gaming content</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Switch Content
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Switch News</CardTitle>
            <CardDescription>Nintendo Switch updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">35</p>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Switch Reviews</CardTitle>
            <CardDescription>Nintendo exclusive reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">22</p>
            <p className="text-xs text-muted-foreground">Published reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Switch Guides</CardTitle>
            <CardDescription>Nintendo gaming guides</CardDescription>
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