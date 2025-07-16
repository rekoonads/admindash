"use client"

import { useState } from "react"
import { ContentEditor } from "@/components/content-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, EyeOff, Send, Archive } from "lucide-react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Post {
  id: string
  title: string
  author: string
  status: "draft" | "published" | "scheduled" | "hidden"
  views: number
  category: string
  createdAt: string
}

interface PostManagerProps {
  type: string
  posts: Post[]
}

export function PostManager({ type, posts: initialPosts }: PostManagerProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | "bulk" | null>(null)

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || post.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleSelectAll = (checked: boolean) => {
    setSelectedPosts(checked ? filteredPosts.map(p => p.id) : [])
  }

  const handleSelectPost = (postId: string, checked: boolean) => {
    setSelectedPosts(prev => 
      checked ? [...prev, postId] : prev.filter(id => id !== postId)
    )
  }

  const handleStatusChange = (postId: string, newStatus: Post["status"]) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, status: newStatus } : post
    ))
  }

  const handleBulkStatusChange = (newStatus: Post["status"]) => {
    setPosts(prev => prev.map(post => 
      selectedPosts.includes(post.id) ? { ...post, status: newStatus } : post
    ))
    setSelectedPosts([])
  }

  const handleDelete = (postId?: string) => {
    if (postId) {
      setPosts(prev => prev.filter(post => post.id !== postId))
    } else {
      setPosts(prev => prev.filter(post => !selectedPosts.includes(post.id)))
      setSelectedPosts([])
    }
    setShowDeleteDialog(false)
    setDeleteTarget(null)
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setShowEditor(true)
  }

  const handleCreateNew = () => {
    setEditingPost(null)
    setShowEditor(true)
  }

  const handleSave = () => {
    setShowEditor(false)
    setEditingPost(null)
  }

  if (showEditor) {
    return (
      <ContentEditor
        type={editingPost ? `Edit ${type}` : `New ${type}`}
        initialTitle={editingPost?.title}
        initialContent={editingPost ? `<h1>${editingPost.title}</h1><p>Edit your ${type.toLowerCase()} content here...</p>` : ""}
        onSave={handleSave}
        onPublish={handleSave}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{type}s</h1>
          <p className="text-muted-foreground">Manage your {type.toLowerCase()} content</p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          New {type}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All {type}s</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={`Search ${type.toLowerCase()}s...`}
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
          {selectedPosts.length > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-muted rounded-lg">
              <span className="text-sm">{selectedPosts.length} selected</span>
              <Button size="sm" onClick={() => handleBulkStatusChange("published")}>
                <Send className="h-4 w-4 mr-1" />
                Publish
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("draft")}>
                <Archive className="h-4 w-4 mr-1" />
                Draft
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkStatusChange("hidden")}>
                <EyeOff className="h-4 w-4 mr-1" />
                Hide
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => {
                  setDeleteTarget("bulk")
                  setShowDeleteDialog(true)
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
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
                  <TableCell>
                    <Checkbox
                      checked={selectedPosts.includes(post.id)}
                      onCheckedChange={(checked) => handleSelectPost(post.id, !!checked)}
                    />
                  </TableCell>
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
                        <DropdownMenuItem>
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
                          onClick={() => {
                            setDeleteTarget(post.id)
                            setShowDeleteDialog(true)
                          }}
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget === "bulk" 
                ? `Are you sure you want to delete ${selectedPosts.length} selected ${type.toLowerCase()}s?`
                : `Are you sure you want to delete this ${type.toLowerCase()}?`
              } This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDelete(deleteTarget === "bulk" ? undefined : deleteTarget!)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}