"use client"

import { MediaGallery } from '@/components/media-gallery'

export default function MediaPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">Manage your images, videos, and documents</p>
        </div>
      </div>

      <MediaGallery />
    </div>
  )
}