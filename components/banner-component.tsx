"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ImageUpload } from './image-upload'
import { Save, Eye } from 'lucide-react'

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
  initialData?: Partial<BannerData>
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
    isActive: initialData?.isActive ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleImageChange = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }))
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Banner Configuration</CardTitle>
        <CardDescription>Create and manage website banners</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Banner Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter banner title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="page">Target Page</Label>
              <Select value={formData.page} onValueChange={(value) => setFormData(prev => ({ ...prev, page: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="reviews">Reviews</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="guides">Guides</SelectItem>
                  <SelectItem value="all">All Pages</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Banner Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter banner description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Banner Image</Label>
            <ImageUpload
              value={formData.imageUrl}
              onChange={handleImageChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkUrl">Link URL</Label>
              <Input
                id="linkUrl"
                value={formData.linkUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select value={formData.position} onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TOP">Top</SelectItem>
                  <SelectItem value="BOTTOM">Bottom</SelectItem>
                  <SelectItem value="SIDEBAR">Sidebar</SelectItem>
                  <SelectItem value="HERO">Hero</SelectItem>
                  <SelectItem value="INLINE">Inline</SelectItem>
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
            <Label htmlFor="isActive">Active Banner</Label>
          </div>

          {formData.imageUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-4">
                  <img
                    src={formData.imageUrl}
                    alt="Banner preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{formData.title}</h3>
                    <p className="text-sm text-gray-600">{formData.content}</p>
                    <p className="text-xs text-blue-600">{formData.linkUrl}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Save Banner
            </Button>
            <Button type="button" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}