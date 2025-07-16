"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Image, Eye, EyeOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Banner {
  id: string
  title: string
  imageUrl: string
  linkUrl: string
  page: string
  position: "top" | "middle" | "bottom"
  isActive: boolean
  createdAt: string
}

const mockBanners: Banner[] = [
  {
    id: "1",
    title: "Gaming Sale Banner",
    imageUrl: "/placeholder.jpg",
    linkUrl: "https://example.com/sale",
    page: "news",
    position: "top",
    isActive: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "New Review Alert",
    imageUrl: "/placeholder.jpg",
    linkUrl: "https://example.com/reviews",
    page: "reviews",
    position: "middle",
    isActive: false,
    createdAt: "2024-01-14",
  },
]

export function BannerManager() {
  const [banners, setBanners] = useState<Banner[]>(mockBanners)
  const [showDialog, setShowDialog] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    linkUrl: "",
    page: "",
    position: "top" as const,
    isActive: true,
  })

  const handleSave = () => {
    if (editingBanner) {
      setBanners(prev => prev.map(banner => 
        banner.id === editingBanner.id 
          ? { ...banner, ...formData }
          : banner
      ))
    } else {
      setBanners(prev => [...prev, {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
      }])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      imageUrl: "",
      linkUrl: "",
      page: "",
      position: "top",
      isActive: true,
    })
    setEditingBanner(null)
    setShowDialog(false)
  }

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      page: banner.page,
      position: banner.position,
      isActive: banner.isActive,
    })
    setShowDialog(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      setBanners(prev => prev.filter(banner => banner.id !== id))
    }
  }

  const toggleActive = (id: string) => {
    setBanners(prev => prev.map(banner => 
      banner.id === id ? { ...banner, isActive: !banner.isActive } : banner
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banner Management</h1>
          <p className="text-muted-foreground">Manage banners across all pages</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBanner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
              <DialogDescription>
                Create or update banner for your pages
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Banner Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter banner title"
                />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                  placeholder="https://example.com/banner.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label>Link URL</Label>
                <Input
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({...formData, linkUrl: e.target.value})}
                  placeholder="https://example.com/destination"
                />
              </div>
              <div className="space-y-2">
                <Label>Page</Label>
                <Select value={formData.page} onValueChange={(value) => setFormData({...formData, page: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="reviews">Reviews</SelectItem>
                    <SelectItem value="videos">Videos</SelectItem>
                    <SelectItem value="game-guides">Game Guides</SelectItem>
                    <SelectItem value="anime-corner">Anime Corner</SelectItem>
                    <SelectItem value="tech-zone">Tech Zone</SelectItem>
                    <SelectItem value="comics-hub">Comics Hub</SelectItem>
                    <SelectItem value="all">All Pages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Position</Label>
                <Select value={formData.position} onValueChange={(value: any) => setFormData({...formData, position: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="middle">Middle</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                />
                <Label>Active</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSave}>
                {editingBanner ? "Update" : "Create"} Banner
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Banners</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Banner</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Image className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{banner.title}</div>
                        <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {banner.linkUrl}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{banner.page}</TableCell>
                  <TableCell className="capitalize">{banner.position}</TableCell>
                  <TableCell>
                    <Badge variant={banner.isActive ? "default" : "secondary"}>
                      {banner.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{banner.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActive(banner.id)}
                      >
                        {banner.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(banner)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(banner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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