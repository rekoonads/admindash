"use client"

import { useState } from "react"
import { ContentEditor } from "@/components/content-editor"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus } from "lucide-react"

export default function ComicsPage() {
  const [showEditor, setShowEditor] = useState(false)

  if (showEditor) {
    return (
      <ContentEditor
        type="Comics Article"
        initialCategory="comics"
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
            <BookOpen className="h-8 w-8 text-orange-600" />
            Comics Content
          </h1>
          <p className="text-muted-foreground">Manage comic book news, reviews, and features</p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Comics Content
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Comics News</CardTitle>
            <CardDescription>Latest comic industry news</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">43</p>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comics Reviews</CardTitle>
            <CardDescription>Comic book and graphic novel reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">27</p>
            <p className="text-xs text-muted-foreground">Published reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comics Features</CardTitle>
            <CardDescription>In-depth comic features</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">16</p>
            <p className="text-xs text-muted-foreground">Published features</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}