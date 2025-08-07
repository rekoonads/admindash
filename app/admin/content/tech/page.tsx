"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Plus } from "lucide-react"

export default function TechPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Smartphone className="h-8 w-8 text-green-600" />
            Tech Content
          </h1>
          <p className="text-muted-foreground">Manage technology news and reviews</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Tech Content
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tech News</CardTitle>
            <CardDescription>Latest technology news</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">89</p>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tech Reviews</CardTitle>
            <CardDescription>Hardware and software reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">42</p>
            <p className="text-xs text-muted-foreground">Published reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tech Features</CardTitle>
            <CardDescription>In-depth tech analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">28</p>
            <p className="text-xs text-muted-foreground">Published features</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}