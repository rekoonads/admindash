"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Plus } from "lucide-react"

export default function EsportsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-600" />
            Esports Content
          </h1>
          <p className="text-muted-foreground">Manage esports news, tournaments, and coverage</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Esports Content
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Esports News</CardTitle>
            <CardDescription>Tournament and team updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">76</p>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tournament Coverage</CardTitle>
            <CardDescription>Live tournament coverage</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">31</p>
            <p className="text-xs text-muted-foreground">Published coverage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Player Profiles</CardTitle>
            <CardDescription>Professional player features</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">19</p>
            <p className="text-xs text-muted-foreground">Published profiles</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}