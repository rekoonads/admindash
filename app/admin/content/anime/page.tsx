"use client"

import { useState } from "react"
import { ContentEditor } from "@/components/content-editor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tv, Plus } from "lucide-react"

export default function AnimePage() {
  const [showEditor, setShowEditor] = useState(false)

  if (showEditor) {
    return (
      <ContentEditor
        type="Anime Article"
        initialCategory="anime"
        onSave={() => setShowEditor(false)}
        onPublish={() => setShowEditor(false)}
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Tv className="h-8 w-8 text-purple-600" />
            Anime Content
          </h1>
          <p className="text-muted-foreground">Manage anime news, reviews, and features</p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Anime Content
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Anime News</CardTitle>
            <CardDescription>Latest anime industry news</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">67</p>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Anime Reviews</CardTitle>
            <CardDescription>Series and movie reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">34</p>
            <p className="text-xs text-muted-foreground">Published reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Anime Features</CardTitle>
            <CardDescription>In-depth anime features</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">21</p>
            <p className="text-xs text-muted-foreground">Published features</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}