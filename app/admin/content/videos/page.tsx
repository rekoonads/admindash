"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Video, Plus, Search, Filter } from "lucide-react"
import { useIsMobile } from "@/components/ui/use-mobile"

export default function VideosPage() {
  const isMobile = useIsMobile()
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set("type", "VIDEO")
    
    // Move video URL to image field for compatibility
    const videoUrl = formData.get("videoUrl")
    if (videoUrl) {
      formData.set("image", videoUrl as string)
    }

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setShowCreateForm(false)
        window.location.reload()
      }
    } catch (error) {
      console.error("Error creating video:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const mockVideos = [
    {
      id: "1",
      title: "Spider-Man 2 Complete Walkthrough",
      description: "Full gameplay walkthrough of Spider-Man 2",
      videoUrl: "https://youtube.com/watch?v=example1",
      thumbnail: "/placeholder.jpg",
      duration: "45:30",
      views: 125000,
      status: "PUBLISHED",
      category: "Gaming",
      platform: "PS5",
      createdAt: "2024-01-15"
    },
    {
      id: "2", 
      title: "Top 10 Indie Games 2024",
      description: "Best indie games released this year",
      videoUrl: "https://youtube.com/watch?v=example2",
      thumbnail: "/placeholder.jpg",
      duration: "12:45",
      views: 89000,
      status: "PUBLISHED",
      category: "Gaming",
      platform: "PC",
      createdAt: "2024-01-10"
    }
  ]

  return (
    <div className="space-y-6">
      <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-center justify-between'}`}>
        <div>
          <h1 className="text-3xl font-bold">Video Content</h1>
          <p className="text-muted-foreground">Manage gaming videos and content</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Video
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'items-center'}`}>
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search videos..." className="pl-8" />
            </div>
            <Select>
              <SelectTrigger className={isMobile ? 'w-full' : 'w-[180px]'}>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="reviews">Reviews</SelectItem>
                <SelectItem value="guides">Guides</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className={isMobile ? 'w-full' : 'w-[180px]'}>
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pc">PC</SelectItem>
                <SelectItem value="ps5">PlayStation 5</SelectItem>
                <SelectItem value="xbox">Xbox</SelectItem>
                <SelectItem value="switch">Nintendo Switch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Create Video Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Video</CardTitle>
            <CardDescription>Create a new video content entry</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleCreateVideo}>
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <div className="space-y-2">
                <Label htmlFor="title">Video Title</Label>
                <Input id="title" name="title" placeholder="Enter video title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input id="videoUrl" name="videoUrl" placeholder="YouTube/Vimeo URL (e.g., https://youtube.com/watch?v=...)" required />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="excerpt" placeholder="Video description" rows={3} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Full Content</Label>
              <Textarea id="content" name="content" placeholder="Detailed content" rows={4} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail URL</Label>
              <Input id="thumbnail" name="thumbnail" placeholder="Video thumbnail image URL" />
            </div>

            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Input id="platform" name="platform" placeholder="PC, PS5, Xbox, etc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input id="genre" name="genre" placeholder="Action, RPG, etc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="DRAFT">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Save Video"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Videos List */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
        {mockVideos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="h-12 w-12 text-gray-400" />
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                {video.duration}
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {video.description}
              </p>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="secondary">{video.category}</Badge>
                <Badge variant="outline">{video.platform}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{video.views.toLocaleString()} views</span>
                <span>{video.createdAt}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="flex-1">
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}