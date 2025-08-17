"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, GripVertical } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
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
  label: string
  url: string
  order: number
  isExternal: boolean
}

const mockMainMenu: MenuItem[] = [
  { id: "1", label: "Home", url: "/", order: 1, isExternal: false },
  { id: "2", label: "News", url: "/news", order: 2, isExternal: false },
  { id: "3", label: "Reviews", url: "/reviews", order: 3, isExternal: false },
  { id: "4", label: "Videos", url: "/videos", order: 4, isExternal: false },
  { id: "5", label: "Game Guides", url: "/guides", order: 5, isExternal: false },
]

function SortableItem({ item, onEdit, onDelete }: { item: MenuItem, onEdit: (item: MenuItem) => void, onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-muted/30"
    >
      <div className="flex items-center gap-3">
        <div {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
        </div>
        <div>
          <div className="font-medium">{item.label}</div>
          <div className="text-sm text-muted-foreground">{item.url}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant={item.isExternal ? "secondary" : "outline"}>
          {item.isExternal ? "External" : "Internal"}
        </Badge>
        <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(item.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function MenusPage() {
  const [mainMenu, setMainMenu] = useState<MenuItem[]>(mockMainMenu)
  const [showDialog, setShowDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formData, setFormData] = useState({
    label: "",
    url: "",
    isExternal: false,
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setMainMenu((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSave = () => {
    if (editingItem) {
      setMainMenu(mainMenu.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ))
    } else {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...formData,
        order: mainMenu.length + 1,
      }
      setMainMenu([...mainMenu, newItem])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({ label: "", url: "", isExternal: false })
    setEditingItem(null)
    setShowDialog(false)
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      label: item.label,
      url: item.url,
      isExternal: item.isExternal,
    })
    setShowDialog(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      setMainMenu(mainMenu.filter(item => item.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Menu Item" : "Create Menu Item"}</DialogTitle>
            <DialogDescription>
              Add or update a menu item
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Menu Label</Label>
              <Input
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
                placeholder="Enter menu label"
              />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
                placeholder="/page or https://external.com"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleSave}>
              {editingItem ? "Update" : "Create"} Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle>Main Menu</CardTitle>
              <Badge variant="secondary">{mainMenu.length} items</Badge>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowDialog(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={mainMenu} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {mainMenu.map((item) => (
                  <SortableItem
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  )
}