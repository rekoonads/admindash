"use client"

import { useState, useEffect } from "react"
import { ContentEditor } from "@/components/content-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Send,
  Archive,
  RefreshCw,
} from "lucide-react"
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
import { getPosts, deletePost, updatePostStatus } from "@/lib/actions"
import type { Post } from "@/lib/prisma"

interface ContentManagementPageProps {
  title: string
  description: string
  contentType: string
  category: string
  icon?: React.ComponentType<{ className?: string }>
  apiEndpoint?: string
}

export function ContentManagementPage({
  title,
  description,
  contentType,
  category,
  icon: Icon,
  apiEndpoint = "/api/articles"
}: ContentManagementPageProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setRefreshing(true)
      console.log(`Fetching posts for category: ${category}`);
      const data = await getPosts({ category })
      setPosts(data)
      console.log(`Fetched ${contentType}:`, data.length)
      console.log('Posts data:', data.map(p => ({ title: p.title, category: p.category?.slug || p.category_id })));
    } catch (error) {
      console.error(`Error fetching ${contentType}:`, error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter.toUpperCase()
    return matchesSearch && matchesStatus
  })

  const handleCreateNew = () => {
    setEditingPost(null)
    setShowEditor(true)
  }

  const handleEdit = (post: Post) => {
    setEditingPost(post)
    setShowEditor(true)
  }

  const handleView = (post: Post) => {
    if (post.slug) {
      window.open(`https://koodos.in/article/${category}/${post.slug}`, "_blank")
    } else {
      alert(
        `Viewing: ${post.title}\\nAuthor: ${post.author}\\nStatus: ${post.status}`
      )
    }
  }

  const handleStatusChange = async (
    postId: string,
    newStatus: "DRAFT" | "PUBLISHED" | "HIDDEN"
  ) => {
    try {
      await updatePostStatus(postId, newStatus)
      await fetchPosts()
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Error updating post status")
    }
  }

  const handleDelete = async (postId: string) => {
    if (confirm(`Are you sure you want to delete this ${contentType.toLowerCase()}?`)) {
      try {
        await deletePost(postId)
        await fetchPosts()
      } catch (error) {
        console.error("Error deleting post:", error)
        alert("Error deleting post")
      }
    }
  }

  const handleSave = () => {
    setShowEditor(false)
    setEditingPost(null)
    fetchPosts()
  }

  const handlePublish = () => {
    setShowEditor(false)
    setEditingPost(null)
    fetchPosts()
  }

  if (showEditor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ContentEditor
          type={contentType}
          initialTitle={editingPost?.title}
          initialContent={editingPost?.content}
          initialExcerpt={editingPost?.excerpt || ""}
          initialCategory={category}
          initialStatus={editingPost?.status as "DRAFT" | "PUBLISHED" | "HIDDEN" | undefined}
          editingPost={editingPost}
          onSave={handleSave}
          onPublish={handlePublish}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-4"></div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {Icon && <Icon className="h-6 w-6" />}
            {title}
          </h1>
          <p className="text-muted-foreground">
            {description} ({posts.length} total items)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchPosts} disabled={refreshing}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={handleCreateNew}>
            <Plus className="h-4 w-4 mr-2" />
            New {contentType}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All {title} ({filteredPosts.length})</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={`Search ${title.toLowerCase()}...`}
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
          {filteredPosts.length > 0 ? (
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
                    <TableCell className="font-medium max-w-[300px]">
                      <div className="truncate" title={post.title}>
                        {post.title}
                      </div>
                    </TableCell>
                    <TableCell>{post.author || "Unknown"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          post.status === "PUBLISHED"
                            ? "default"
                            : post.status === "HIDDEN"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {post.status.toLowerCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.category?.name || post.category_id || "Uncategorized"}</TableCell>
                    <TableCell>{post.views.toLocaleString()}</TableCell>
                    <TableCell>
                      {new Date(post.created_at).toLocaleDateString()}
                    </TableCell>
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
                          {post.status !== "PUBLISHED" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(post.id, "PUBLISHED")
                              }
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Publish
                            </DropdownMenuItem>
                          )}
                          {post.status !== "DRAFT" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(post.id, "DRAFT")
                              }
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Draft
                            </DropdownMenuItem>
                          )}
                          {post.status !== "HIDDEN" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(post.id, "HIDDEN")
                              }
                            >
                              <EyeOff className="h-4 w-4 mr-2" />
                              Hide
                            </DropdownMenuItem>
                          )}
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
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm || statusFilter !== "all" ? (
                <div>
                  <p>No {title.toLowerCase()} found matching your criteria.</p>
                  <p className="text-sm mt-2">
                    Try adjusting your search terms or filters.
                  </p>
                </div>
              ) : (
                <div>
                  <p>No {title.toLowerCase()} found.</p>
                  <Button onClick={handleCreateNew} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First {contentType}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}