"use client"

import { useState } from "react"
import { ContentEditor } from "@/components/content-editor"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function SpotlightsPage() {
  const [showEditor, setShowEditor] = useState(false)

  if (showEditor) {
    return (
      <ContentEditor
        type="spotlights"
        onSave={() => setShowEditor(false)}
        onPublish={() => setShowEditor(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Spotlights</h1>
          <p className="text-muted-foreground">Manage featured content and spotlights</p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Spotlight
        </Button>
      </div>
    </div>
  )
}