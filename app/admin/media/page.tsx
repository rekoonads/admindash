"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Upload,
  Search,
  ImageIcon,
  FileText,
  Video,
  Download,
  Crop,
  FileArchiveIcon as Compress,
  Plus,
  Filter,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function MediaLibraryPage() {
  const [files, setFiles] = useState([
    {
      name: "product-hero.jpg",
      type: "Image",
      size: "2.4 MB",
      uploaded: "2024-01-15",
      url: "/placeholder.svg?height=100&width=100",
      icon: ImageIcon,
      tags: ["product", "hero"],
    },
    {
      name: "company-brochure.pdf",
      type: "Document",
      size: "1.8 MB",
      uploaded: "2024-01-14",
      url: "#",
      icon: FileText,
      tags: ["marketing", "document"],
    },
    {
      name: "product-demo.mp4",
      type: "Video",
      size: "15.2 MB",
      uploaded: "2024-01-13",
      url: "#",
      icon: Video,
      tags: ["product", "demo"],
    },
    {
      name: "logo-transparent.png",
      type: "Image",
      size: "456 KB",
      uploaded: "2024-01-12",
      url: "/placeholder.svg?height=100&width=100",
      icon: ImageIcon,
      tags: ["branding", "logo"],
    },
  ])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || [])
    // Simulate upload and add to state
    const newFiles = uploadedFiles.map((file, index) => ({
      name: file.name,
      type: file.type.startsWith("image") ? "Image" : file.type.startsWith("video") ? "Video" : "Document",
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploaded: new Date().toISOString().split("T")[0],
      url: file.type.startsWith("image") ? URL.createObjectURL(file) : "#", // Use blob URL for preview
      icon: file.type.startsWith("image") ? ImageIcon : file.type.startsWith("video") ? Video : FileText,
      tags: [],
    }))
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">Upload and manage your images, videos, and documents</p>
        </div>
        <Button>
          <label htmlFor="file-upload" className="cursor-pointer flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Upload Files
          </label>
          <Input id="file-upload" type="file" multiple className="hidden" onChange={handleFileUpload} />
        </Button>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Files</CardTitle>
          <CardDescription>Drag and drop files here, or click to browse.</CardDescription>
        </CardHeader>
        <CardContent>
          <label
            htmlFor="drag-drop-upload"
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer block"
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Drag & Drop Files</h3>
            <p className="text-muted-foreground mb-4">or click to browse</p>
            <Button variant="outline" className="bg-transparent">
              Choose Files
            </Button>
            <Input id="drag-drop-upload" type="file" multiple className="hidden" onChange={handleFileUpload} />
          </label>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>All Media</CardTitle>
          <div className="flex items-center gap-4 mt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search media..." className="pl-8" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {files.map((file, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {file.type === "Image" ? (
                        <img
                          src={file.url || "/placeholder.svg"}
                          alt={file.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                          <file.icon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{file.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {file.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{file.size}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {file.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      {file.type === "Image" && (
                        <>
                          <Button variant="ghost" size="sm">
                            <Crop className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Compress className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
