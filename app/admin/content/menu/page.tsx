"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Menu, Trash2, Edit, GripVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function MenuPage() {
  const mainMenuItems = [
    { id: 1, title: "Latest News", url: "/news", type: "Page", status: "Published" },
    { id: 2, title: "Game Reviews", url: "/reviews", type: "Collection", status: "Published" },
    { id: 3, title: "Gaming Hub", url: "/gaming", type: "Page", status: "Published" },
    { id: 4, title: "Tech Zone", url: "/tech", type: "Page", status: "Published" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">Manage your site navigation menus</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Menu className="h-5 w-5" />
              Main Menu
            </CardTitle>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mainMenuItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                    <Badge variant={item.status === "Published" ? "default" : "secondary"} className="text-xs">
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.url}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
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