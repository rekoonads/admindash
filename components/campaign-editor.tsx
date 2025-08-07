"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"

interface CampaignEditorProps {
  onSave: () => void
  onClose: () => void
}

export function CampaignEditor({ onSave, onClose }: CampaignEditorProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Campaign</h1>
          <p className="text-muted-foreground">Design your email campaign</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Campaign Name</label>
            <Input placeholder="Enter campaign name" />
          </div>
          <div>
            <label className="text-sm font-medium">Subject Line</label>
            <Input placeholder="Enter email subject" />
          </div>
          <div>
            <label className="text-sm font-medium">Content</label>
            <Textarea placeholder="Enter email content" rows={10} />
          </div>
          <div className="flex gap-2">
            <Button onClick={onSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Campaign
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}