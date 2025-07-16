"use client"

import { useState, StrictMode } from "react"
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
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"

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
  { id: "6", label: "Anime Corner", url: "/anime", order: 6, isExternal: false },
  { id: "7", label: "Tech Zone", url: "/tech", order: 7, isExternal: false },
  { id: "8", label: "Comics Hub", url: "/comics", order: 8, isExternal: false },
]

const mockFooterMenu: MenuItem[] = [
  { id: "9", label: "Privacy Policy", url: "/privacy-policy", order: 1, isExternal: false },
  { id: "10", label: "About KOODOS India", url: "/about", order: 2, isExternal: false },
  { id: "11", label: "Contact the Editorial Staff", url: "/contact", order: 3, isExternal: false },
  { id: "12", label: "Advertise", url: "/advertise", order: 4, isExternal: false },
  { id: "13", label: "Press", url: "/press", order: 5, isExternal: false },
  { id: "14", label: "User Agreement", url: "/user-agreement", order: 6, isExternal: false },
  { id: "15", label: "Cookie Policy", url: "/cookie-policy", order: 7, isExternal: false },
  { id: "16", label: "RSS", url: "/rss", order: 8, isExternal: false },
]

export default function MenusPage() {
  const [mainMenu, setMainMenu] = useState<MenuItem[]>(mockMainMenu)
  const [footerMenu, setFooterMenu] = useState<MenuItem[]>(mockFooterMenu)
  const [showDialog, setShowDialog] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [currentMenuType, setCurrentMenuType] = useState<"main" | "footer">("main")
  const [formData, setFormData] = useState({
    label: "",
    url: "",
    isExternal: false,
  })
  const [openItems, setOpenItems] = useState<string[]>(["main"])

  const getCurrentMenu = () => currentMenuType === "main" ? mainMenu : footerMenu
  const setCurrentMenu = (items: MenuItem[]) => {
    if (currentMenuType === "main") {
      setMainMenu(items)
    } else {
      setFooterMenu(items)
    }
  }

  const handleSave = () => {
    const currentMenu = getCurrentMenu()
    
    if (editingItem) {
      setCurrentMenu(currentMenu.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      ))
    } else {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        ...formData,
        order: currentMenu.length + 1,
      }
      setCurrentMenu([...currentMenu, newItem])
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
      const currentMenu = getCurrentMenu()
      setCurrentMenu(currentMenu.filter(item => item.id !== id))
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    
    const sourceId = result.source.droppableId
    const menuType = sourceId === "main-menu" ? "main" : "footer"
    const items = menuType === "main" ? [...mainMenu] : [...footerMenu]
    
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    const reorderedItems = items.map((item, index) => ({
      ...item,
      order: index + 1
    }))
    
    if (menuType === "main") {
      setMainMenu(reorderedItems)
    } else {
      setFooterMenu(reorderedItems)
    }
  }

  const openCreateDialog = (menuType: "main" | "footer") => {
    setCurrentMenuType(menuType)
    resetForm()
    setShowDialog(true)
  }

  return (
    <StrictMode>
    <div className="space-y-6">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Menu Item" : "Create Menu Item"}</DialogTitle>
            <DialogDescription>
              Add or update a menu item for your {currentMenuType} menu
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="space-y-4">
          {/* Main Menu Section */}
          <Card>
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setOpenItems(prev => 
                prev.includes("main") ? prev.filter(item => item !== "main") : [...prev, "main"]
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Main Menu</CardTitle>
                  <Badge variant="secondary">{mainMenu.length} items</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentMenuType("main")
                      setShowDialog(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                  <div className={`transition-transform ${
                    openItems.includes("main") ? "rotate-180" : ""
                  }`}>
                    ▼
                  </div>
                </div>
              </div>
            </CardHeader>
            {openItems.includes("main") && (
              <CardContent>
                <Droppable droppableId="main-menu" type="DEFAULT" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false} renderClone={undefined}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {mainMenu.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-muted/30 ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div {...provided.dragHandleProps}>
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
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setCurrentMenuType("main")
                                    handleEdit(item)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            )}
          </Card>

          {/* Footer Menu Section */}
          <Card>
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setOpenItems(prev => 
                prev.includes("footer") ? prev.filter(item => item !== "footer") : [...prev, "footer"]
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Footer Menu</CardTitle>
                  <Badge variant="secondary">{footerMenu.length} items</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentMenuType("footer")
                      setShowDialog(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                  <div className={`transition-transform ${
                    openItems.includes("footer") ? "rotate-180" : ""
                  }`}>
                    ▼
                  </div>
                </div>
              </div>
            </CardHeader>
            {openItems.includes("footer") && (
              <CardContent>
                <Droppable droppableId="footer-menu" type="DEFAULT" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false} renderClone={undefined}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {footerMenu.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-muted/30 ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div {...provided.dragHandleProps}>
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
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setCurrentMenuType("footer")
                                    handleEdit(item)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            )}
          </Card>
        </div>
      </DragDropContext>
    </div>
    </StrictMode>
  )
}