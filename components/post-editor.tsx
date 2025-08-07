"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Upload, Trash2 } from "lucide-react"

interface PostEditorProps {
  title: string
  onSave: () => void
  onPublish: () => void
  onCancel: () => void
}

export function PostEditor({ title, onSave, onPublish, onCancel }: PostEditorProps) {
  const [status, setStatus] = useState("draft") // 'draft', 'published', 'scheduled'

  return (
    <div className="grid grid-cols-3 gap-6 py-4">
      {/* Main Content - Left Side */}
      <div className="col-span-2 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="post-title">Title</Label>
          <Input id="post-title" placeholder={`Enter ${title.toLowerCase()} title`} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" placeholder={`auto-generated-slug-for-${title.toLowerCase()}`} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <RichTextEditor
            placeholder={`Write your ${title.toLowerCase()} content here...`}
            className="min-h-[300px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            placeholder="Add a summary of the post to appear on your home page or blog."
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Search Engine Listing</h3>
          <div className="space-y-2">
            <Label htmlFor="seo-title">SEO Title</Label>
            <Input id="seo-title" placeholder="Add a title for search engines" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo-description">SEO Description</Label>
            <Textarea
              id="seo-description"
              placeholder="Add a description to see how this post might appear in a search engine listing"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Sidebar - Right Side */}
      <div className="space-y-6">
        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="status">Publish Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {status === "scheduled" && (
              <div className="space-y-2">
                <Label htmlFor="publish-date">Publish Date</Label>
                <Input id="publish-date" type="datetime-local" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Image Gallery */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Image Gallery</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Upload image or drop an image to upload</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                Choose Image
              </Button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {/* Placeholder for uploaded images */}
              <div className="relative group aspect-video rounded-md overflow-hidden border">
                <img
                  src="/placeholder.svg?height=100&width=150"
                  alt="Placeholder"
                  className="object-cover w-full h-full"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="john">John Admin</SelectItem>
                  <SelectItem value="jane">Jane Admin</SelectItem>
                  <SelectItem value="mike">Mike Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="reviews">Reviews</SelectItem>
                  <SelectItem value="guides">Guides</SelectItem>
                  <SelectItem value="videos">Videos</SelectItem>
                  <SelectItem value="anime">Anime</SelectItem>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="comics">Comics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input id="tags" placeholder="Add tags separated by commas" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
