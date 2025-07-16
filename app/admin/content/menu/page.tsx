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
    { id: 5, title: "Video Content", url: "/videos", type: "Collection", status: "Published" },
    { id: 6, title: "Anime Corner", url: "/anime", type: "Page", status: "Published" },
    { id: 7, title: "Discussions", url: "/discussions", type: "Page", status: "Published" },
    { id: 8, title: "Deep Dives", url: "/deep-dives", type: "Collection", status: "Published" },
    { id: 9, title: "Game Guides", url: "/guides", type: "Collection", status: "Published" },
    { id: 10, title: "Top Lists", url: "/top-lists", type: "Collection", status: "Published" },
    { id: 11, title: "Community", url: "/community", type: "Page", status: "Published" },
    { id: 12, title: "Comics Hub", url: "/comics", type: "Page", status: "Published" },
    { id: 13, title: "Social", url: "/social", type: "Page", status: "Published" },
  ]

  const footerMenuItems = [
    // Content Section
    { id: 1, title: "Content", url: "#", type: "Header", status: "Published", section: "content" },
    { id: 2, title: "News", url: "/news", type: "Page", status: "Published", section: "content" },
    { id: 3, title: "Reviews", url: "/reviews", type: "Page", status: "Published", section: "content" },
    { id: 4, title: "Features", url: "/features", type: "Page", status: "Published", section: "content" },
    { id: 5, title: "Guides", url: "/guides", type: "Page", status: "Published", section: "content" },
    { id: 6, title: "Videos", url: "/videos", type: "Page", status: "Published", section: "content" },

    // Gaming Section
    { id: 7, title: "Gaming", url: "#", type: "Header", status: "Published", section: "gaming" },
    { id: 8, title: "PC Gaming", url: "/pc-gaming", type: "Page", status: "Published", section: "gaming" },
    { id: 9, title: "PlayStation", url: "/playstation", type: "Page", status: "Published", section: "gaming" },
    { id: 10, title: "Xbox", url: "/xbox", type: "Page", status: "Published", section: "gaming" },
    { id: 11, title: "Nintendo Switch", url: "/nintendo-switch", type: "Page", status: "Published", section: "gaming" },
    { id: 12, title: "Mobile Gaming", url: "/mobile-gaming", type: "Page", status: "Published", section: "gaming" },

    // Entertainment Section
    { id: 13, title: "Entertainment", url: "#", type: "Header", status: "Published", section: "entertainment" },
    {
      id: 14,
      title: "Anime & Manga",
      url: "/anime-manga",
      type: "Page",
      status: "Published",
      section: "entertainment",
    },
    { id: 15, title: "Comics", url: "/comics", type: "Page", status: "Published", section: "entertainment" },
    { id: 16, title: "Science", url: "/science", type: "Page", status: "Published", section: "entertainment" },
    { id: 17, title: "Tech", url: "/tech", type: "Page", status: "Published", section: "entertainment" },
    { id: 18, title: "Cosplay", url: "/cosplay", type: "Page", status: "Published", section: "entertainment" },

    // Community Section
    { id: 19, title: "Community", url: "#", type: "Header", status: "Published", section: "community" },
    { id: 20, title: "Follow Us", url: "/follow", type: "Page", status: "Published", section: "community" },
    { id: 21, title: "Forums", url: "/forums", type: "Page", status: "Published", section: "community" },
    { id: 22, title: "Podcasts", url: "/podcasts", type: "Page", status: "Published", section: "community" },

    // Store Section
    { id: 23, title: "Store", url: "#", type: "Header", status: "Published", section: "store" },
    { id: 24, title: "Deals", url: "/deals", type: "Page", status: "Published", section: "store" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">Manage your site navigation menus</p>
        </div>
      </div>

      {/* Main Menu */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Menu className="h-5 w-5" />
                Main Menu
              </CardTitle>
            </div>
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

      {/* Footer Menu */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Menu className="h-5 w-5" />
                Footer Menu
              </CardTitle>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Menu Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Group footer items by section */}
          {["content", "gaming", "entertainment", "community", "store"].map((section) => {
            const sectionItems = footerMenuItems.filter((item) => item.section === section)
            const headerItem = sectionItems.find((item) => item.type === "Header")
            const childItems = sectionItems.filter((item) => item.type !== "Header")

            return (
              <div key={section} className="mb-6">
                {headerItem && (
                  <div className="flex items-center gap-3 p-3 border rounded-lg mb-2 bg-muted/50">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-primary">{headerItem.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {headerItem.type}
                        </Badge>
                        <Badge
                          variant={headerItem.status === "Published" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {headerItem.status}
                        </Badge>
                      </div>
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
                )}

                <div className="space-y-2 ml-6">
                  {childItems.map((item) => (
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
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
