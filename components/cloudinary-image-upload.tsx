"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageIcon, Upload, X } from 'lucide-react'
import Image from 'next/image'

interface CloudinaryImageUploadProps {
  value: string
  onChange: (url: string) => void
  onRemove: () => void
  disabled?: boolean
}

export function CloudinaryImageUpload({
  value,
  onChange,
  onRemove,
  disabled
}: CloudinaryImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        onChange(data.url)
      } else {
        console.error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput('')
    }
  }

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <Button
            type="button"
            onClick={onRemove}
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button
                  type="button"
                  variant="outline"
                  disabled={disabled || isUploading}
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                  disabled={disabled || isUploading}
                />
              </label>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Or paste image URL"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={disabled}
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              disabled={disabled || !urlInput.trim()}
            >
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}