"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BannerComponent } from '@/components/banner-component'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Banner {
  id: string
  title: string
  content: string
  imageUrl: string
  linkUrl: string
  position: string
  page: string
  isActive: boolean
  createdAt: string
}

export default function BannersPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)

  // Mock data - replace with actual API call
  const banners: Banner[] = [
    {
      id: '1',
      title: 'Gaming Sale 2024',
      content: 'Up to 70% off on top gaming titles',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      linkUrl: 'https://koodos.in/sale',
      position: 'TOP',
      page: 'home',
      isActive: true,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'New Review Series',
      content: 'Check out our latest game reviews',
      imageUrl: 'https://res.cloudinary.com/demo/image/upload/sample2.jpg',
      linkUrl: 'https://koodos.in/reviews',
      position: 'SIDEBAR',
      page: 'reviews',
      isActive: false,
      createdAt: '2024-01-14T15:45:00Z'
    }
  ]

  const handleSaveBanner = (bannerData: any) => {
    console.log('Saving banner:', bannerData)
    // Add API call here
    setShowCreateForm(false)
    setEditingBanner(null)
  }

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner)
    setShowCreateForm(true)
  }

  const handleDeleteBanner = (id: string) => {
    console.log('Deleting banner:', id)
    // Add API call here
  }

  if (showCreateForm) {
    return (
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {editingBanner ? 'Edit Banner' : 'Create Banner'}
            </h1>
            <p className="text-muted-foreground">
              {editingBanner ? 'Update banner configuration' : 'Create a new website banner'}
            </p>
          </div>
          <Button variant="outline" onClick={() => {
            setShowCreateForm(false)
            setEditingBanner(null)
          }}>
            Back to Banners
          </Button>
        </div>

        <div className="flex justify-center">
          <BannerComponent
            initialData={editingBanner || undefined}
            onSave={handleSaveBanner}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Banners</h1>
          <p className="text-muted-foreground">Manage promotional banners across your website</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Banner
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {banners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden">
            <div className="aspect-video relative bg-gray-100">
              {banner.imageUrl ? (
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
            
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{banner.title}</CardTitle>
              <CardDescription>{banner.content}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Position:</span>
                <Badge variant="outline">{banner.position}</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Page:</span>
                <Badge variant="outline">{banner.page}</Badge>
              </div>
              
              {banner.linkUrl && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Link:</span>
                  <p className="text-blue-600 truncate">{banner.linkUrl}</p>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditBanner(banner)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(banner.linkUrl, '_blank')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteBanner(banner.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground mb-4">No banners created yet</p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Banner
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}