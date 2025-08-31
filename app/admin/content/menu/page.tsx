"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, GripVertical, Menu, ChevronDown, ChevronRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface MenuItem {
  id: string
  name: string
  href: string
  icon?: string
  order: number
  isActive: boolean
  isExternal: boolean
  parentId?: string
  location: 'navbar' | 'footer'
  children?: MenuItem[]
}

const iconOptions = [
  { value: "Home", label: "Home" },
  { value: "Star", label: "Star" },
  { value: "BookOpen", label: "Book" },
  { value: "Gamepad2", label: "Gaming" },
  { value: "Monitor", label: "Monitor" },
  { value: "Video", label: "Video" },
  { value: "MessageCircle", label: "Message" },
  { value: "List", label: "List" },
  { value: "Newspaper", label: "News" },
  { value: "Phone", label: "Phone" },
  { value: "Users", label: "Users" },
  { value: "Trophy", label: "Trophy" },
  { value: "Mail", label: "Mail" },
  { value: "Shield", label: "Shield" },
  { value: "FileText", label: "Document" },
  { value: "ExternalLink", label: "External" },
]

function SortableMenuItem({ 
  item, 
  onEdit, 
  onDelete, 
  onToggleExpand, 
  isExpanded,
  level = 0 
}: { 
  item: MenuItem
  onEdit: (item: MenuItem) => void
  onDelete: (id: string) => void
  onToggleExpand: (id: string) => void
  isExpanded: boolean
  level?: number
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div 
        className={`flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors ${
          level > 0 ? 'ml-8 border-l-2 border-l-blue-200' : ''
        }`}
      >
        <div {...attributes} {...listeners} className="cursor-move">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        
        {item.children && item.children.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-6 w-6"
            onClick={() => onToggleExpand(item.id)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{item.name}</span>
            <Badge variant={item.isActive ? "default" : "secondary"} className="text-xs">
              {item.isActive ? "Active" : "Inactive"}
            </Badge>
            {item.isExternal && (
              <Badge variant="outline" className="text-xs">External</Badge>
            )}
            {item.children && item.children.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {item.children.length} items
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{item.href}</p>
          {item.icon && (
            <p className="text-xs text-muted-foreground">Icon: {item.icon}</p>
          )}
        </div>
        
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [activeTab, setActiveTab] = useState<'navbar' | 'footer'>('navbar')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    href: "",
    icon: "",
    isActive: true,
    isExternal: false,
    location: 'navbar' as 'navbar' | 'footer',
    parentId: "",
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Initialize with complete menu structure
  useEffect(() => {
    // Try to load saved menu items from localStorage first
    const savedItems = localStorage.getItem('koodos-menu-items')
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems)
        setMenuItems(parsedItems)
        return
      } catch (error) {
        console.error('Failed to parse saved menu items:', error)
      }
    }
    
    // Fallback to default menu structure
    const allItems: MenuItem[] = [
      // Navbar items
      { id: "nav-1", name: "Home", href: "/", icon: "Home", order: 1, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-2", name: "Latest Updates", href: "/latest-updates", icon: "Newspaper", order: 2, isActive: true, isExternal: false, location: 'navbar' },
      
      // Reviews with submenus
      { id: "nav-3", name: "Reviews", href: "/reviews", icon: "Star", order: 3, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-3-1", name: "All Reviews", href: "/reviews", icon: "Star", order: 1, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-3" },
      { id: "nav-3-2", name: "Game Reviews", href: "/reviews/games", icon: "Gamepad2", order: 2, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-3" },
      { id: "nav-3-3", name: "Movie Reviews", href: "/reviews/movies", icon: "Video", order: 3, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-3" },
      { id: "nav-3-4", name: "TV Reviews", href: "/reviews/tv", icon: "Monitor", order: 4, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-3" },
      { id: "nav-3-5", name: "Comic Reviews", href: "/reviews/comics", icon: "BookOpen", order: 5, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-3" },
      { id: "nav-3-6", name: "Tech Reviews", href: "/reviews/tech", icon: "Monitor", order: 6, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-3" },
      
      { id: "nav-4", name: "Interviews", href: "/interviews", icon: "MessageCircle", order: 4, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-5", name: "Spotlights", href: "/spotlights", icon: "Star", order: 5, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-6", name: "Top Lists", href: "/top-lists", icon: "List", order: 6, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-7", name: "Opinions", href: "/opinions", icon: "MessageCircle", order: 7, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-8", name: "Guides", href: "/guides", icon: "BookOpen", order: 8, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-9", name: "Wiki", href: "/wiki", icon: "BookOpen", order: 9, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-10", name: "Videos", href: "/videos", icon: "Video", order: 10, isActive: true, isExternal: false, location: 'navbar' },
      
      // Gaming with submenus
      { id: "nav-11", name: "Gaming", href: "/gaming", icon: "Gamepad2", order: 11, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-11-1", name: "Nintendo", href: "/gaming/nintendo", icon: "Gamepad2", order: 1, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-11" },
      { id: "nav-11-2", name: "Xbox", href: "/gaming/xbox", icon: "Gamepad2", order: 2, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-11" },
      { id: "nav-11-3", name: "PlayStation", href: "/gaming/playstation", icon: "Gamepad2", order: 3, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-11" },
      { id: "nav-11-4", name: "PC", href: "/gaming/pc", icon: "Monitor", order: 4, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-11" },
      { id: "nav-11-5", name: "Mobile", href: "/gaming/mobile", icon: "Phone", order: 5, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-11" },
      
      { id: "nav-12", name: "Tech", href: "/tech", icon: "Monitor", order: 12, isActive: true, isExternal: false, location: 'navbar' },
      
      // Anime & Manga with submenus
      { id: "nav-13", name: "Anime & Manga", href: "/anime-manga", icon: "Star", order: 13, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-13-1", name: "All Anime Coverage", href: "/anime-manga/anime", icon: "Video", order: 1, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-13" },
      { id: "nav-13-2", name: "Cosplay", href: "/anime-manga/cosplay", icon: "Star", order: 2, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-13" },
      
      { id: "nav-14", name: "Science & Comics", href: "/science-comics", icon: "BookOpen", order: 14, isActive: true, isExternal: false, location: 'navbar' },
      
      // Follow Koodos with submenus
      { id: "nav-15", name: "Follow Koodos", href: "/follow", icon: "Star", order: 15, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-15-1", name: "Social Media Links", href: "/follow/social", icon: "Star", order: 1, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-15" },
      { id: "nav-15-2", name: "Newsletter", href: "/follow/newsletter", icon: "MessageCircle", order: 2, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-15" },
      
      // More with submenus
      { id: "nav-16", name: "More", href: "/more", icon: "List", order: 16, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-16-1", name: "About Koodos", href: "/more/about", icon: "Home", order: 1, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
      { id: "nav-16-2", name: "Contact Editorial Team", href: "/more/contact", icon: "MessageCircle", order: 2, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
      { id: "nav-16-3", name: "Advertise With Us", href: "/more/advertise", icon: "Star", order: 3, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
      { id: "nav-16-4", name: "Press", href: "/more/press", icon: "BookOpen", order: 4, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
      { id: "nav-16-5", name: "User Agreement", href: "/more/terms", icon: "BookOpen", order: 5, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
      { id: "nav-16-6", name: "Privacy Policy", href: "/more/privacy", icon: "BookOpen", order: 6, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
      { id: "nav-16-7", name: "Cookie Policy", href: "/more/cookies", icon: "BookOpen", order: 7, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
      { id: "nav-16-8", name: "RSS", href: "/more/rss", icon: "BookOpen", order: 8, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
      
      // Footer items - Gaming Content
      { id: "footer-1", name: "Gaming Content", href: "/gaming", order: 1, isActive: true, isExternal: false, location: 'footer' },
      { id: "footer-1-1", name: "Latest Gaming News", href: "/", order: 1, isActive: true, isExternal: false, location: 'footer', parentId: "footer-1" },
      { id: "footer-1-2", name: "Game Reviews & Ratings", href: "/reviews", order: 2, isActive: true, isExternal: false, location: 'footer', parentId: "footer-1" },
      { id: "footer-1-3", name: "Gaming Guides & Tips", href: "/guides", order: 3, isActive: true, isExternal: false, location: 'footer', parentId: "footer-1" },
      { id: "footer-1-4", name: "PC Gaming Hardware", href: "/gaming/pc", order: 4, isActive: true, isExternal: false, location: 'footer', parentId: "footer-1" },
      { id: "footer-1-5", name: "Mobile Gaming", href: "/gaming/mobile", order: 5, isActive: true, isExternal: false, location: 'footer', parentId: "footer-1" },
      { id: "footer-1-6", name: "Esports & Tournaments", href: "/esports", order: 6, isActive: true, isExternal: false, location: 'footer', parentId: "footer-1" },
      { id: "footer-1-7", name: "Gaming Videos", href: "/videos", order: 7, isActive: true, isExternal: false, location: 'footer', parentId: "footer-1" },
      
      // Footer items - Gaming Community
      { id: "footer-2", name: "Gaming Community", href: "/community", order: 2, isActive: true, isExternal: false, location: 'footer' },
      { id: "footer-2-1", name: "Gaming Discussions", href: "/discussions", order: 1, isActive: true, isExternal: false, location: 'footer', parentId: "footer-2" },
      { id: "footer-2-2", name: "Indian Gaming Hub", href: "/community", order: 2, isActive: true, isExternal: false, location: 'footer', parentId: "footer-2" },
      { id: "footer-2-3", name: "User Game Reviews", href: "/user-reviews", order: 3, isActive: true, isExternal: false, location: 'footer', parentId: "footer-2" },
      { id: "footer-2-4", name: "Gaming Forums", href: "/forums", order: 4, isActive: true, isExternal: false, location: 'footer', parentId: "footer-2" },
      { id: "footer-2-5", name: "Discord Gaming Server", href: "/discord", order: 5, isActive: true, isExternal: true, location: 'footer', parentId: "footer-2" },
      { id: "footer-2-6", name: "Reddit r/IndianGaming", href: "/reddit", order: 6, isActive: true, isExternal: true, location: 'footer', parentId: "footer-2" },
      { id: "footer-2-7", name: "Gaming Tournaments", href: "/tournaments", order: 7, isActive: true, isExternal: false, location: 'footer', parentId: "footer-2" },
      
      // Footer items - KOODOS
      { id: "footer-3", name: "KOODOS", href: "/about", order: 3, isActive: true, isExternal: false, location: 'footer' },
      { id: "footer-3-1", name: "About KOODOS", href: "/about", order: 1, isActive: true, isExternal: false, location: 'footer', parentId: "footer-3" },
      { id: "footer-3-2", name: "Contact Gaming Team", href: "/contact", order: 2, isActive: true, isExternal: false, location: 'footer', parentId: "footer-3" },
      { id: "footer-3-3", name: "Join Our Team", href: "/careers", order: 3, isActive: true, isExternal: false, location: 'footer', parentId: "footer-3" },
      { id: "footer-3-4", name: "Gaming Press Kit", href: "/press", order: 4, isActive: true, isExternal: false, location: 'footer', parentId: "footer-3" },
      { id: "footer-3-5", name: "Gaming Partnerships", href: "/partnership", order: 5, isActive: true, isExternal: false, location: 'footer', parentId: "footer-3" },
      { id: "footer-3-6", name: "Advertise with Gamers", href: "/advertise", order: 6, isActive: true, isExternal: false, location: 'footer', parentId: "footer-3" },
      { id: "footer-3-7", name: "Gaming Awards", href: "/awards", order: 7, isActive: true, isExternal: false, location: 'footer', parentId: "footer-3" },
      
      // Footer items - Legal
      { id: "footer-4", name: "Legal", href: "/legal", order: 4, isActive: true, isExternal: false, location: 'footer' },
      { id: "footer-4-1", name: "Privacy Policy", href: "/privacy", order: 1, isActive: true, isExternal: false, location: 'footer', parentId: "footer-4" },
      { id: "footer-4-2", name: "Terms of Service", href: "/terms", order: 2, isActive: true, isExternal: false, location: 'footer', parentId: "footer-4" },
      { id: "footer-4-3", name: "Cookie Policy", href: "/cookies", order: 3, isActive: true, isExternal: false, location: 'footer', parentId: "footer-4" },
      { id: "footer-4-4", name: "Sitemap", href: "/sitemap", order: 4, isActive: true, isExternal: false, location: 'footer', parentId: "footer-4" },
    ]

    setMenuItems(allItems)
  }, [])

  const filteredItems = menuItems.filter(item => item.location === activeTab)
  const topLevelItems = filteredItems.filter(item => !item.parentId)
  const parentOptions = topLevelItems.filter(item => item.id !== editingItem?.id)

  const buildHierarchy = (items: MenuItem[]): MenuItem[] => {
    const itemMap = new Map<string, MenuItem & { children: MenuItem[] }>()
    
    // Initialize all items with empty children array
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] })
    })
    
    const result: MenuItem[] = []

    items.forEach(item => {
      const menuItem = itemMap.get(item.id)!
      if (item.parentId && itemMap.has(item.parentId)) {
        const parent = itemMap.get(item.parentId)!
        parent.children.push(menuItem)
      } else {
        result.push(menuItem)
      }
    })

    return result.sort((a, b) => a.order - b.order)
  }

  const hierarchicalItems = buildHierarchy(filteredItems)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const currentItems = topLevelItems.slice().sort((a, b) => a.order - b.order)
    const activeIndex = currentItems.findIndex(item => item.id === active.id)
    const overIndex = currentItems.findIndex(item => item.id === over.id)

    if (activeIndex !== -1 && overIndex !== -1) {
      const reorderedItems = arrayMove(currentItems, activeIndex, overIndex)
      const updatedItems = menuItems.map(item => {
        if (item.location === activeTab && !item.parentId) {
          const newIndex = reorderedItems.findIndex(reordered => reordered.id === item.id)
          return { ...item, order: newIndex + 1 }
        }
        return item
      })
      setMenuItems(updatedItems)
      setHasUnsavedChanges(true)
    }
  }

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleSave = () => {
    const processedFormData = {
      ...formData,
      parentId: formData.parentId === "none" ? "" : formData.parentId
    }
    
    if (editingItem) {
      setMenuItems(menuItems.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...processedFormData }
          : item
      ))
    } else {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...processedFormData,
        order: topLevelItems.length + 1,
      }
      setMenuItems([...menuItems, newItem])
    }
    setHasUnsavedChanges(true)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      href: "",
      icon: "",
      isActive: true,
      isExternal: false,
      location: activeTab,
      parentId: "none",
    })
    setEditingItem(null)
    setShowDialog(false)
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      href: item.href,
      icon: item.icon || "",
      isActive: item.isActive,
      isExternal: item.isExternal,
      location: item.location,
      parentId: item.parentId || "",
    })
    setShowDialog(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this menu item and all its children?")) {
      setMenuItems(menuItems.filter(item => item.id !== id && item.parentId !== id))
      setHasUnsavedChanges(true)
    }
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuItems),
      })
      
      if (!response.ok) {
        throw new Error('Failed to save')
      }
      
      // Save to localStorage as backup
      localStorage.setItem('koodos-menu-items', JSON.stringify(menuItems))
      
      setHasUnsavedChanges(false)
      alert('Menu changes saved successfully!')
    } catch (error) {
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const renderMenuItems = (items: MenuItem[], level = 0) => {
    return items.map(item => (
      <div key={item.id}>
        <SortableMenuItem
          item={item}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleExpand={toggleExpanded}
          isExpanded={expandedItems.has(item.id)}
          level={level}
        />
        {item.children && expandedItems.has(item.id) && (
          <div className="ml-4">
            {renderMenuItems(item.children, level + 1)}
          </div>
        )}
      </div>
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Menu className="h-6 w-6" />
            Menu Management
          </h1>
          <p className="text-muted-foreground">
            Manage navigation menus with drag & drop and nested submenus
          </p>
        </div>
        <div className="flex gap-3">
          {hasUnsavedChanges && (
            <Button 
              onClick={handleSaveChanges} 
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Menu Item
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('navbar')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'navbar' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Navbar Menu
        </button>
        <button
          onClick={() => setActiveTab('footer')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'footer' 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Footer Menu
        </button>
      </div>

      {/* Menu Items with Drag & Drop */}
      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'navbar' ? 'Navbar' : 'Footer'} Menu Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={hierarchicalItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {renderMenuItems(hierarchicalItems)}
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Menu Item" : "Add Menu Item"}</DialogTitle>
            <DialogDescription>
              Configure menu item settings and hierarchy
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Menu Label</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., Game Reviews"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="href">URL/Path</Label>
              <Input
                id="href"
                value={formData.href}
                onChange={(e) => setFormData({...formData, href: e.target.value})}
                placeholder="e.g., /reviews"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">Parent Menu (Optional)</Label>
              <Select 
                value={formData.parentId} 
                onValueChange={(value) => setFormData({...formData, parentId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent menu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top Level)</SelectItem>
                  {parentOptions.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select 
                value={formData.icon} 
                onValueChange={(value) => setFormData({...formData, icon: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isExternal"
                checked={formData.isExternal}
                onCheckedChange={(checked) => setFormData({...formData, isExternal: checked})}
              />
              <Label htmlFor="isExternal">External Link</Label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleSave}>
              {editingItem ? "Update" : "Create"} Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}