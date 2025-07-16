"use client"

import type * as React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/mock-auth"
import { useRouter } from "next/navigation"
import { Home, FileText, MessageCircle, ImageIcon, BarChart3, Users, Settings, ChevronDown, Shield } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail, // This component enables clicking to expand the collapsed sidebar
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Menu items for admin dashboard
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Home,
    },
    {
      title: "Content Management",
      icon: FileText,
      items: [
        {
          title: "News",
          url: "/admin/content/news",
        },
        {
          title: "Reviews",
          url: "/admin/content/reviews",
        },
        {
          title: "Videos",
          url: "/admin/content/videos",
        },
        {
          title: "Game Guides",
          url: "/admin/content/game-guides",
        },
        {
          title: "MENUS",
          url: "/admin/menus",
        },
      ],
    },
    {
      title: "Community",
      icon: MessageCircle,
      items: [
        {
          title: "Comments",
          url: "/admin/community/comments",
        },
        {
          title: "Discussions",
          url: "/admin/community/discussions",
        },
        {
          title: "Polls",
          url: "/admin/community/polls",
        },
      ],
    },
    {
      title: "Media Library",
      url: "/admin/media",
      icon: ImageIcon,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Marketing",
      icon: MessageCircle,
      items: [
        {
          title: "Campaigns",
          url: "/admin/marketing/campaigns",
        },
        {
          title: "Attribution",
          url: "/admin/marketing/attribution",
        },
      ],
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { organization } = useAuth()
  const router = useRouter()
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (title: string) => {
    setOpenItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const handleNavigation = (url: string, e: React.MouseEvent) => {
    e.preventDefault()
    router.push(url)
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin" onClick={(e) => handleNavigation("/admin", e)}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Admin Panel</span>
                  <span className="truncate text-xs">{organization?.name || "Organization"}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible
                      open={openItems.includes(item.title)}
                      onOpenChange={() => toggleItem(item.title)}
                      className="group/collapsible"
                    >
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <item.icon />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <a href={subItem.url} onClick={(e) => handleNavigation(subItem.url, e)}>
                                  <span>{subItem.title}</span>
                                </a>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <a href={item.url} onClick={(e) => handleNavigation(item.url, e)}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail /> {/* This component allows clicking to expand the collapsed sidebar */}
    </Sidebar>
  )
}
