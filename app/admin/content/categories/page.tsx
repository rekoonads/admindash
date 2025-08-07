"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Tag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function CategoriesPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: "News", slug: "news", count: 120, description: "Latest news and updates" },
    { id: 2, name: "Reviews", slug: "reviews", count: 85, description: "Product and game reviews" },
    { id: 3, name: "Videos", slug: "videos", count: 50, description: "Video content and tutorials" },
    { id: 4, name: "Game Guides", slug: "game-guides", count: 30, description: "Gaming guides and walkthroughs" },
    { id: 5, name: "Anime Corner", slug: "anime-corner", count: 40, description: "Anime reviews and discussions" },
    { id: 6, name: "Tech Zone", slug: "tech-zone", count: 60, description: "Technology news and reviews" },
    { id: 7, name: "Comics Hub", slug: "comics-hub", count: 25, description: "Comic book reviews and news" },
  ])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategorySlug, setNewCategorySlug] = useState("")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")
  const [editingCategory, setEditingCategory] = useState(null)
  const [showDialog, setShowDialog] = useState(false)

  const addCategory = () => {
    if (newCategoryName.trim() && newCategorySlug.trim()) {
      setCategories([
        ...categories,
        {
          id: categories.length + 1,
          name: newCategoryName,
          slug: newCategorySlug,
          description: newCategoryDescription,
          count: 0,
        },
      ])
      setNewCategoryName("")
      setNewCategorySlug("")
      setNewCategoryDescription("")
      setShowDialog(false)
    }
  }

  const deleteCategory = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((cat) => cat.id !== id))
    }
  }

  const editCategory = (category) => {
    setEditingCategory(category)
    setNewCategoryName(category.name)
    setNewCategorySlug(category.slug)
    setNewCategoryDescription(category.description)
    setShowDialog(true)
  }

  const updateCategory = () => {
    setCategories(categories.map(cat => 
      cat.id === editingCategory.id 
        ? { ...cat, name: newCategoryName, slug: newCategorySlug, description: newCategoryDescription }
        : cat
    ))
    setEditingCategory(null)
    setNewCategoryName("")
    setNewCategorySlug("")
    setNewCategoryDescription("")
    setShowDialog(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">Manage content categories and tags</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingCategory(null)
              setNewCategoryName("")
              setNewCategorySlug("")
              setNewCategoryDescription("")
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
              <DialogDescription>
                {editingCategory ? "Update category details." : "Create a new category for your content."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  placeholder="e.g., Action Games"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-slug">Slug</Label>
                <Input
                  id="category-slug"
                  placeholder="e.g., action-games"
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category-description">Description</Label>
                <Input
                  id="category-description"
                  placeholder="Brief description of the category"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
              <Button onClick={editingCategory ? updateCategory : addCategory}>
                {editingCategory ? "Update" : "Add"} Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Tag className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                    <p className="text-xs text-muted-foreground">Slug: {category.slug} • {category.count} posts</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => editCategory(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteCategory(category.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
