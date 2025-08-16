"use client"

import { useState } from "react"
import { ContentEditor } from "@/components/content-editor"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function TopListsPage() {
  const [showEditor, setShowEditor] = useState(false)

  if (showEditor) {
    return (
      <ContentEditor
        type="top-lists"
        onSave={() => setShowEditor(false)}
        onPublish={() => setShowEditor(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Top Lists</h1>
          <p className="text-muted-foreground">Manage curated top lists and rankings</p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New List
        </Button>
      </div>
    </div>
  )
}