"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Search, ImageIcon, FileText, Video, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function FilesPage() {
  const files = [
    {
      name: "product-hero.jpg",
      type: "Image",
      size: "2.4 MB",
      uploaded: "2024-01-15",
      url: "/placeholder.svg?height=100&width=100",
      icon: ImageIcon,
    },
    {
      name: "company-brochure.pdf",
      type: "Document",
      size: "1.8 MB",
      uploaded: "2024-01-14",
      url: "#",
      icon: FileText,
    },
    {
      name: "product-demo.mp4",
      type: "Video",
      size: "15.2 MB",
      uploaded: "2024-01-13",
      url: "#",
      icon: Video,
    },
    {
      name: "logo-transparent.png",
      type: "Image",
      size: "456 KB",
      uploaded: "2024-01-12",
      url: "/placeholder.svg?height=100&width=100",
      icon: ImageIcon,
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Files</h1>
          <p className="text-muted-foreground">Upload and manage your files</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Files
        </Button>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Files</CardTitle>
          <CardDescription>Files can be images, videos, documents, and more.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload files</h3>
            <p className="text-muted-foreground mb-4">Drag and drop files here, or click to browse</p>
            <Button>Choose Files</Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>File Library</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search files..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {files.map((file, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {file.type === "Image" ? (
                        <img
                          src={file.url || "/placeholder.svg"}
                          alt={file.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
                          <file.icon className="h-6 w-6 text-muted-foreground" />
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
                      <p className="text-xs text-muted-foreground mt-1">Uploaded {file.uploaded}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
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
