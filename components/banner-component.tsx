"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ImageUpload } from './image-upload'

interface BannerData {
  title: string
  content: string
  imageUrl: string
  linkUrl: string
  position: string
  page: string
  isActive: boolean
}

interface BannerComponentProps {
  initialData?: BannerData
  onSave: (data: BannerData) => void
}

export function BannerComponent({ initialData, onSave }: BannerComponentProps) {
  const [formData, setFormData] = useState<BannerData>({
    title: initialData?.title || '',
    content: initialData?.content || '',
    imageUrl: initialData?.imageUrl || '',
    linkUrl: initialData?.linkUrl || '',
    position: initialData?.position || 'TOP',
    page: initialData?.page || 'home',
    isActive: initialData?.isActive || true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Banner Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Banner title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Banner description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Banner Image</Label>
            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
              disabled={false}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkUrl">Link URL</Label>
            <Input
              id="linkUrl"
              value={formData.linkUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
              placeholder="https://koodos.in/page"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Position</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOP">Top</SelectItem>
                  <SelectItem value="SIDEBAR">Sidebar</SelectItem>
                  <SelectItem value="BOTTOM">Bottom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Page</Label>
              <Select
                value={formData.page}
                onValueChange={(value) => setFormData(prev => ({ ...prev, page: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="reviews">Reviews</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="guides">Guides</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <Button type="submit" className="w-full">
            Save Banner
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}