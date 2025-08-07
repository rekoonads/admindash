"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Atom, Plus } from "lucide-react"

export default function SciencePage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Atom className="h-8 w-8 text-cyan-600" />
            Science Content
          </h1>
          <p className="text-muted-foreground">Manage science news and educational content</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Science Content
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Science News</CardTitle>
            <CardDescription>Latest scientific discoveries</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">34</p>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Research Features</CardTitle>
            <CardDescription>In-depth research analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">18</p>
            <p className="text-xs text-muted-foreground">Published features</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Educational Content</CardTitle>
            <CardDescription>Science education articles</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">25</p>
            <p className="text-xs text-muted-foreground">Published guides</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}