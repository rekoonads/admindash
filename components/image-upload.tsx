"use client"

import { useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { Button } from '@/components/ui/button'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
    setIsUploading(false)
  }

  const onRemove = () => {
    onChange('')
  }

  return (
    <div className="space-y-4">
      {value && (
        <div className="relative w-full h-60 rounded-lg overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt="Upload"
            src={value}
          />
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              onClick={onRemove}
              variant="destructive"
              size="sm"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <CldUploadWidget
        onUpload={onUpload}
        uploadPreset="koodos_preset"
        options={{
          maxFiles: 1,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          maxFileSize: 10000000, // 10MB
        }}
      >
        {({ open }) => {
          const onClick = () => {
            setIsUploading(true)
            open()
          }

          return (
            <Button
              type="button"
              disabled={disabled || isUploading}
              variant="secondary"
              onClick={onClick}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload Image'}
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}