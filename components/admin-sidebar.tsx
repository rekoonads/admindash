"use client"

import type * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Home,
  Star,
  BookOpen,
  Gamepad2,
  Monitor,
  MessageSquare,
  List,
  Phone,
  Share2,
  ChevronDown,
  Newspaper,
  Video,
  Lightbulb,
  MessageCircle,
  HelpCircle,
  Globe,
  Tv,
  Palette,
  Atom,
  Mail,
  Info,
  FileText,
  Shield,
  Cookie,
  Briefcase,
  Rss,
  Search,
  Settings,
  Users,
  BarChart3,
  FileEdit,
  Image,
  Target,
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

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: Home,
    },
    {
      title: "Content",
      icon: FileEdit,
      items: [
        {
          title: "Latest Updates",
          url: "/admin/content/latest-updates",
        },
        {
          title: "Reviews",
          url: "/admin/content/reviews",
        },
        {
          title: "Interviews",
          url: "/admin/content/interviews",
        },
        {
          title: "Spotlights",
          url: "/admin/content/spotlights",
        },
        {
          title: "Top Lists",
          url: "/admin/content/top-lists",
        },
        {
          title: "Opinions",
          url: "/admin/content/opinions",
        },
        {
          title: "Guides",
          url: "/admin/content/guides",
        },
        {
          title: "Videos",
          url: "/admin/content/videos",
        },
        {
          title: "Gaming",
          url: "/admin/content/gaming",
        },
        {
          title: "Tech",
          url: "/admin/content/tech",
        },
        {
          title: "Anime & Manga",
          url: "/admin/content/anime",
        },
        {
          title: "Science & Comics",
          url: "/admin/content/science",
        },
      ],
    },
    {
      title: "SEO",
      icon: Search,
      items: [
        {
          title: "Overview",
          url: "/admin/seo",
        },
        {
          title: "Meta Descriptions",
          url: "/admin/seo/meta",
        },
        {
          title: "Issues",
          url: "/admin/seo/issues",
        },
        {
          title: "Suggestions",
          url: "/admin/seo/suggestions",
        },
      ],
    },
    {
      title: "Media",
      url: "/admin/media",
      icon: Image,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Marketing",
      url: "/admin/marketing",
      icon: Target,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
    {
      title: "Pages",
      icon: FileText,
      items: [
        {
          title: "About",
          url: "/admin/pages/about",
        },
        {
          title: "Contact",
          url: "/admin/pages/contact",
        },
        {
          title: "Privacy",
          url: "/admin/pages/privacy",
        },
        {
          title: "Terms",
          url: "/admin/pages/user-agreement",
        },
      ],
    },
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Latest Updates",
      url: "/latest-updates",
      icon: Newspaper,
    },
    {
      title: "Reviews",
      icon: Star,
      items: [
        {
          title: "All Reviews",
          url: "/reviews",
        },
        {
          title: "Game Reviews",
          url: "/reviews/games",
        },
        {
          title: "Movie Reviews",
          url: "/reviews/movies",
        },
        {
          title: "TV Reviews",
          url: "/reviews/tv",
        },
        {
          title: "Comic Reviews",
          url: "/reviews/comics",
        },
        {
          title: "Tech Reviews",
          url: "/reviews/tech",
        },
      ],
    },
    {
      title: "Interviews",
      url: "/interviews",
      icon: MessageCircle,
    },
    {
      title: "Spotlights",
      url: "/spotlights",
      icon: Lightbulb,
    },
    {
      title: "Top Lists",
      url: "/top-lists",
      icon: List,
    },
    {
      title: "Opinions",
      url: "/opinions",
      icon: MessageSquare,
    },
    {
      title: "Guides",
      url: "/guides",
      icon: HelpCircle,
    },
    {
      title: "Wiki",
      url: "/wiki",
      icon: Globe,
    },
    {
      title: "Videos",
      url: "/videos",
      icon: Video,
    },
    {
      title: "Gaming",
      icon: Gamepad2,
      items: [
        {
          title: "Nintendo",
          url: "/gaming/nintendo",
        },
        {
          title: "Xbox",
          url: "/gaming/xbox",
        },
        {
          title: "PlayStation",
          url: "/gaming/playstation",
        },
        {
          title: "PC",
          url: "/gaming/pc",
        },
        {
          title: "Mobile",
          url: "/gaming/mobile",
        },
      ],
    },
    {
      title: "Tech",
      url: "/tech",
      icon: Monitor,
    },
    {
      title: "Anime & Manga",
      icon: Palette,
      items: [
        {
          title: "All Anime Coverage",
          url: "/anime-manga/anime",
        },
        {
          title: "Cosplay",
          url: "/anime-manga/cosplay",
        },
      ],
    },
    {
      title: "Science & Comics",
      url: "/science-comics",
      icon: Atom,
    },
    {
      title: "Follow Koodos",
      icon: Share2,
      items: [
        {
          title: "Social Media Links",
          url: "/follow/social",
        },
        {
          title: "Newsletter",
          url: "/follow/newsletter",
        },
      ],
    },
    {
      title: "More",
      icon: Info,
      items: [
        {
          title: "About Koodos",
          url: "/more/about",
        },
        {
          title: "Contact Editorial Team",
          url: "/more/contact",
        },
        {
          title: "Advertise With Us",
          url: "/more/advertise",
        },
        {
          title: "Press",
          url: "/more/press",
        },
        {
          title: "User Agreement",
          url: "/more/terms",
        },
        {
          title: "Privacy Policy",
          url: "/more/privacy",
        },
        {
          title: "Cookie Policy",
          url: "/more/cookies",
        },
        {
          title: "RSS",
          url: "/more/rss",
        },
      ],
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
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">KOODOS</span>
                  <span className="truncate text-xs">Gaming Hub</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
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