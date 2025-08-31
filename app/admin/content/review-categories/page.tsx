"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Gamepad2, Film, Tv, BookOpen, Monitor } from "lucide-react"

const defaultCategories = [
  { id: '1', name: 'games', display_name: 'Game Reviews', icon: 'Gamepad2', color: 'text-blue-400', is_active: true },
  { id: '2', name: 'movies', display_name: 'Movie Reviews', icon: 'Film', color: 'text-red-400', is_active: true },
  { id: '3', name: 'tv', display_name: 'TV Reviews', icon: 'Tv', color: 'text-green-400', is_active: true },
  { id: '4', name: 'comics', display_name: 'Comic Reviews', icon: 'BookOpen', color: 'text-purple-400', is_active: true },
  { id: '5', name: 'tech', display_name: 'Tech Reviews', icon: 'Monitor', color: 'text-yellow-400', is_active: true }
]

export default function ReviewCategoriesPage() {
  const [categories, setCategories] = useState(defaultCategories)
  const [newCategory, setNewCategory] = useState({ name: '', display_name: '' })

  const getIcon = (iconName: string) => {
    const icons = { Gamepad2, Film, Tv, BookOpen, Monitor }
    const Icon = icons[iconName as keyof typeof icons] || Monitor
    return <Icon className="w-5 h-5" />
  }

  const handleSave = () => {
    if (newCategory.name && newCategory.display_name) {
      const category = {
        id: Date.now().toString(),
        name: newCategory.name.toLowerCase(),
        display_name: newCategory.display_name,
        icon: 'Monitor',
        color: 'text-gray-400',
        is_active: true
      }
      setCategories([...categories, category])
      setNewCategory({ name: '', display_name: '' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Review Categories</h1>
          <p className="text-muted-foreground">Manage review categories</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Category name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
            <Input
              placeholder="Display name"
              value={newCategory.display_name}
              onChange={(e) => setNewCategory({ ...newCategory, display_name: e.target.value })}
            />
          </div>
          <Button onClick={handleSave}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4">
                <div className={category.color}>
                  {getIcon(category.icon)}
                </div>
                <div>
                  <h3 className="font-semibold">{category.display_name}</h3>
                  <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}