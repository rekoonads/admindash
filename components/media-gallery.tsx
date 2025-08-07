"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from './image-upload'
import { VideoPlayer } from './video-player'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Filter, Grid, List, Play, Image as ImageIcon, File } from 'lucide-react'

interface MediaItem {
  id: string
  url: string
  type: 'image' | 'video' | 'document'
  filename: string
  size: number
  alt?: string
  caption?: string
  createdAt: string
}

interface MediaGalleryProps {
  onSelect?: (media: MediaItem) => void
  selectedMedia?: MediaItem[]
  multiple?: boolean
}

export function MediaGallery({ onSelect, selectedMedia = [], multiple = false }: MediaGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video' | 'document'>('all')

  // Mock data - replace with actual API call
  const mediaItems: MediaItem[] = [
    {
      id: '1',
      url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      type: 'image',
      filename: 'gaming-screenshot.jpg',
      size: 2048000,
      alt: 'Gaming screenshot',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      url: 'https://res.cloudinary.com/demo/video/upload/sample.mp4',
      type: 'video',
      filename: 'gameplay-trailer.mp4',
      size: 15728640,
      caption: 'Gameplay trailer',
      createdAt: '2024-01-14T15:45:00Z'
    }
  ]

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || item.type === filterType
    return matchesSearch && matchesType
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="h-4 w-4" />
      case 'video': return <Play className="h-4 w-4" />
      default: return <File className="h-4 w-4" />
    }
  }

  const handleMediaSelect = (media: MediaItem) => {
    if (onSelect) {
      onSelect(media)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Media Gallery</CardTitle>
        <CardDescription>Manage your images, videos, and documents</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gallery" className="space-y-4">
            {/* Search and Filter */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search media..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterType === 'image' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('image')}
                >
                  Images
                </Button>
                <Button
                  variant={filterType === 'video' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterType('video')}
                >
                  Videos
                </Button>
              </div>
              <div className="flex gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Media Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleMediaSelect(item)}
                  >
                    <CardContent className="p-2">
                      <div className="aspect-square relative mb-2 bg-gray-100 rounded overflow-hidden">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt={item.alt || item.filename}
                            className="w-full h-full object-cover"
                          />
                        ) : item.type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-black">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <File className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium truncate">{item.filename}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            {getMediaIcon(item.type)}
                            <span className="ml-1">{item.type}</span>
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(item.size)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((item) => (
                  <Card
                    key={item.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleMediaSelect(item)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          {item.type === 'image' ? (
                            <img
                              src={item.url}
                              alt={item.alt || item.filename}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {getMediaIcon(item.type)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.filename}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.alt || item.caption}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {item.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(item.size)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <ImageUpload
              value=""
              onChange={(url) => console.log('Uploaded:', url)}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}