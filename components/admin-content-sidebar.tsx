"use client"

import type * as React from "react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  Home,
  Star,
  BookOpen,
  Gamepad2,
  Monitor,
  MessageSquare,
  List,
  ChevronDown,
  Newspaper,
  Video,
  Lightbulb,
  MessageCircle,
  HelpCircle,
  Globe,
  Palette,
  Atom,
  Settings,
  Users,
  BarChart3,
  FileText,
  Image,
  Tags,
  Folder,
  Plus,
} from "lucide-react"

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

const adminNavData = {
  main: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Home,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
  ],
  content: [
    {
      title: "News",
      url: "/admin/content/news",
      icon: Newspaper,
    },
    {
      title: "Reviews",
      icon: Star,
      items: [
        { title: "All Reviews", url: "/admin/content/reviews" },
        { title: "Game Reviews", url: "/admin/content/reviews?type=games" },
        { title: "Movie Reviews", url: "/admin/content/reviews?type=movies" },
        { title: "TV Reviews", url: "/admin/content/reviews?type=tv" },
        { title: "Comic Reviews", url: "/admin/content/reviews?type=comics" },
        { title: "Tech Reviews", url: "/admin/content/reviews?type=tech" },
      ],
    },
    {
      title: "Gaming",
      icon: Gamepad2,
      items: [
        { title: "Game Guides", url: "/admin/content/game-guides" },
        { title: "Nintendo", url: "/admin/content/nintendo" },
        { title: "Xbox", url: "/admin/content/xbox" },
        { title: "PlayStation", url: "/admin/content/playstation" },
        { title: "PC Gaming", url: "/admin/content/pc" },
        { title: "Mobile Gaming", url: "/admin/content/mobile" },
      ],
    },
    {
      title: "Entertainment",
      icon: Video,
      items: [
        { title: "Videos", url: "/admin/content/videos" },
        { title: "Anime", url: "/admin/content/anime" },
        { title: "Cosplay", url: "/admin/content/cosplay" },
      ],
    },
    {
      title: "Editorial",
      icon: FileText,
      items: [
        { title: "Interviews", url: "/admin/content/interviews" },
        { title: "Spotlights", url: "/admin/content/spotlights" },
        { title: "Top Lists", url: "/admin/content/top-lists" },
        { title: "Opinions", url: "/admin/content/opinions" },
      ],
    },
    {
      title: "Guides & Wiki",
      icon: BookOpen,
      items: [
        { title: "Guides", url: "/admin/content/guides" },
        { title: "Wiki", url: "/admin/content/wiki" },
      ],
    },
    {
      title: "Tech & Science",
      icon: Monitor,
      items: [
        { title: "Tech", url: "/admin/content/tech" },
        { title: "Science & Comics", url: "/admin/content/science" },
      ],
    },
  ],
  management: [
    {
      title: "Categories",
      url: "/admin/content/categories",
      icon: Tags,
    },
    {
      title: "Media Library",
      url: "/admin/content/files",
      icon: Image,
    },
    {
      title: "Banners",
      url: "/admin/content/banners",
      icon: Folder,
    },
    {
      title: "Menu",
      url: "/admin/content/menu",
      icon: List,
    },
  ],
  system: [
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
}

export function AdminContentSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const pathname = usePathname()
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (title: string) => {
    setOpenItems((prev) => (prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]))
  }

  const handleNavigation = (url: string, e: React.MouseEvent) => {
    e.preventDefault()
    router.push(url)
  }

  const isActive = (url: string) => pathname === url

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin" onClick={(e) => handleNavigation("/admin", e)}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">KOODOS</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavData.main.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <a href={item.url} onClick={(e) => handleNavigation(item.url, e)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavData.content.map((item) => (
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
                              <SidebarMenuSubButton asChild isActive={isActive(subItem.url)}>
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
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
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

        {/* Content Management */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavData.management.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <a href={item.url} onClick={(e) => handleNavigation(item.url, e)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNavData.system.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <a href={item.url} onClick={(e) => handleNavigation(item.url, e)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
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