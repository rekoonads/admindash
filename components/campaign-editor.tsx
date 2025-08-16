"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, Save, Send } from 'lucide-react'

interface CampaignEditorProps {
  onSave: () => void
  onClose: () => void
}

export function CampaignEditor({ onSave, onClose }: CampaignEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    template: 'newsletter',
    audience: 'all'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Saving campaign:', formData)
    onSave()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onClose}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create Campaign</h1>
            <p className="text-muted-foreground">Design your email campaign</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={onSave}>
            <Send className="h-4 w-4 mr-2" />
            Send Campaign
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Monthly Newsletter - January"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="New Year, New Gaming Adventures!"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Template</Label>
                <Select
                  value={formData.template}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, template: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Audience</Label>
                <Select
                  value={formData.audience}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, audience: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subscribers</SelectItem>
                    <SelectItem value="active">Active Users</SelectItem>
                    <SelectItem value="premium">Premium Members</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Email Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your email content here..."
                rows={10}
                className="min-h-[300px]"
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}