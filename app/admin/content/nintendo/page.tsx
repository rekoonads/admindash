"use client"

import { useState } from "react"
import { ContentEditor } from "@/components/content-editor"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function NintendoPage() {
  const [showEditor, setShowEditor] = useState(false)

  if (showEditor) {
    return (
      <ContentEditor
        type="nintendo"
        onSave={() => setShowEditor(false)}
        onPublish={() => setShowEditor(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Nintendo Content</h1>
          <p className="text-muted-foreground">Manage Nintendo Switch and Nintendo gaming content</p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Nintendo Article
        </Button>
      </div>
    </div>
  )
}