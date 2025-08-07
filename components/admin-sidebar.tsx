"use client"

import type * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Home, FileText, MessageCircle, ImageIcon, BarChart3, Users, Settings, ChevronDown, Shield, Gamepad2, Star, Video, BookOpen, Newspaper, Tv, Smartphone, Monitor, Headphones } from "lucide-react"

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
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Home,
    },
    {
      title: "Gaming Content",
      icon: Gamepad2,
      items: [
        {
          title: "Gaming News",
          url: "/admin/content/news",
        },
        {
          title: "Game Reviews",
          url: "/admin/content/reviews",
        },
        {
          title: "Game Guides",
          url: "/admin/content/game-guides",
        },
        {
          title: "Gaming Videos",
          url: "/admin/content/videos",
        },
      ],
    },
    {
      title: "Platform Content",
      icon: Monitor,
      items: [
        {
          title: "PC Gaming",
          url: "/admin/content/pc",
        },
        {
          title: "PlayStation 5",
          url: "/admin/content/ps5",
        },
        {
          title: "Xbox",
          url: "/admin/content/xbox",
        },
        {
          title: "Nintendo Switch",
          url: "/admin/content/nintendo-switch",
        },
        {
          title: "Mobile Gaming",
          url: "/admin/content/mobile",
        },
      ],
    },
    {
      title: "Entertainment",
      icon: Tv,
      items: [
        {
          title: "Anime",
          url: "/admin/content/anime",
        },
        {
          title: "Comics",
          url: "/admin/content/comics",
        },
        {
          title: "Esports",
          url: "/admin/content/esports",
        },
      ],
    },
    {
      title: "Tech & Science",
      icon: Smartphone,
      items: [
        {
          title: "Tech News",
          url: "/admin/content/tech",
        },
        {
          title: "Science",
          url: "/admin/content/science",
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
          title: "User Profiles",
          url: "/admin/community/profiles",
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
      icon: BarChart3,
      items: [
        {
          title: "Campaigns",
          url: "/admin/marketing/campaigns",
        },
        {
          title: "Audience",
          url: "/admin/audience",
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
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white">
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">KOODOS Admin</span>
                  <span className="truncate text-xs">Gaming Content Hub</span>
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
      <SidebarRail />
    </Sidebar>
  )
}