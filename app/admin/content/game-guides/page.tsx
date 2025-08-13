"use client"

import { useState } from "react"
import { ContentEditor } from "@/components/content-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, EyeOff, Send, Archive, BookOpen } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Guide {
  id: string
  title: string
  author: string
  status: "draft" | "published" | "scheduled" | "hidden"
  views: number
  category: string
  createdAt: string
}

const mockGuides: Guide[] = [
  {
    id: "1",
    title: "Complete Elden Ring Boss Guide",
    author: "John Admin",
    status: "published",
    views: 5200,
    category: "RPG",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Minecraft Building Tips & Tricks",
    author: "Jane Admin",
    status: "draft",
    views: 0,
    category: "Sandbox",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Speedrun Strategies for Hollow Knight",
    author: "Mike Admin",
    status: "scheduled",
    views: 0,
    category: "Platformer",
    createdAt: "2024-01-13",
  },
]

export default function GameGuidesPage() {
  const [guides, setGuides] = useState<Guide[]>(mockGuides)
  const [showEditor, setShowEditor] = useState(false)
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredGuides = guides.filter((guide) =>
    guide.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleEdit = (guide: Guide) => {
    setEditingGuide(guide)
    setShowEditor(true)
  }

  const handleView = (guide: Guide) => {
    alert(`Viewing: ${guide.title}\nCategory: ${guide.category}\nViews: ${guide.views}`)
  }

  const handleStatusChange = (guideId: string, newStatus: Guide["status"]) => {
    setGuides(prev => prev.map(guide => 
      guide.id === guideId ? { ...guide, status: newStatus } : guide
    ))
  }

  const handleDelete = (guideId: string) => {
    if (confirm("Are you sure you want to delete this guide?")) {
      setGuides(prev => prev.filter(guide => guide.id !== guideId))
    }
  }

  const handleSave = () => {
    setShowEditor(false)
    setEditingGuide(null)
  }

  if (showEditor) {
    return (
      <ContentEditor
        type="Game Guide"
        initialCategory="game-guides"
        initialTitle={editingGuide?.title}
        initialContent={editingGuide ? `<h1>${editingGuide.title}</h1><p>Edit your game guide content here...</p>` : ""}
        onSave={handleSave}
        onPublish={handleSave}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Game Guides</h1>
          <p className="text-muted-foreground">Create comprehensive gaming guides and tutorials</p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Guide
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Guides</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Views</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuides.map((guide) => (
                <TableRow key={guide.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      {guide.title}
                    </div>
                  </TableCell>
                  <TableCell>{guide.author}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        guide.status === "published" ? "default" : 
                        guide.status === "hidden" ? "destructive" : 
                        guide.status === "scheduled" ? "secondary" : "outline"
                      }
                    >
                      {guide.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{guide.category}</TableCell>
                  <TableCell>{guide.views.toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(guide)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleView(guide)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(guide.id, "published")}>
                          <Send className="h-4 w-4 mr-2" />
                          Publish
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(guide.id, "draft")}>
                          <Archive className="h-4 w-4 mr-2" />
                          Draft
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(guide.id, "hidden")}>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Hide
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(guide.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}