"use client"

import { useState } from "react"
import { BannerDisplay } from "@/components/banner-display"
import { ContentEditor } from "@/components/content-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, EyeOff, Send, Archive } from "lucide-react"
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

interface Post {
  id: string
  title: string
  author: string
  status: "draft" | "published" | "hidden"
  views: number
  category: string
  createdAt: string
}

const mockNewsPosts: Post[] = [
  {
    id: "1",
    title: "Latest Gaming Industry Trends",
    author: "John Admin",
    status: "published",
    views: 1234,
    category: "Gaming",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "E3 2024: What to Expect",
    author: "Jane Admin",
    status: "draft",
    views: 0,
    category: "Events",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "New Indie Game Spotlight",
    author: "Mike Admin",
    status: "hidden",
    views: 856,
    category: "Reviews",
    createdAt: "2024-01-13",
  },
]

export default function NewsPage() {
  const [posts, setPosts] = useState<Post[]>(mockNewsPosts)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setShowEditor(true)
  }

  const handleView = (post: Post) => {
    alert(`Viewing: ${post.title}\nAuthor: ${post.author}\nStatus: ${post.status}`)
  }

  const handleStatusChange = (postId: string, newStatus: Post["status"]) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, status: newStatus } : post
    ))
  }

  const handleDelete = (postId: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      setPosts(prev => prev.filter(post => post.id !== postId))
    }
  }

  const handleSave = () => {
    setShowEditor(false)
    setEditingPost(null)
  }

  if (showEditor) {
    return (
      <ContentEditor
        type={editingPost ? "Edit News Article" : "New News Article"}
        initialTitle={editingPost?.title}
        initialContent={editingPost ? `<h1>${editingPost.title}</h1><p>Edit your news article content here...</p>` : ""}
        onSave={handleSave}
        onPublish={handleSave}
      />
    )
  }

  return (
    <div className="space-y-6">
      <BannerDisplay page="news" position="top" />
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">News Articles</h1>
          <p className="text-muted-foreground">Manage your news content</p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Article
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Articles</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
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
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.author}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        post.status === "published" ? "default" : 
                        post.status === "hidden" ? "destructive" : "secondary"
                      }
                    >
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>{post.views.toLocaleString()}</TableCell>
                  <TableCell>{post.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(post)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleView(post)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(post.id, "published")}>
                          <Send className="h-4 w-4 mr-2" />
                          Publish
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(post.id, "draft")}>
                          <Archive className="h-4 w-4 mr-2" />
                          Draft
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(post.id, "hidden")}>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Hide
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(post.id)}
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
      
      <BannerDisplay page="news" position="bottom" />
    </div>
  )
}
