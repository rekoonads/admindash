"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/mock-auth"
import { ChevronRight, Settings, Users, Globe, Shield, FileText, Database } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const settingsMenuItems = [
  {
    title: "General",
    icon: Settings,
    href: "/admin/settings/general",
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/settings/users",
  },
  {
    title: "Metafields and metaobjects",
    icon: Database,
    href: "/admin/settings/metafields",
  },
  {
    title: "Languages",
    icon: Globe,
    href: "/admin/settings/languages",
  },
  {
    title: "Customer privacy",
    icon: Shield,
    href: "/admin/settings/privacy",
  },
  {
    title: "Policies",
    icon: FileText,
    href: "/admin/settings/policies",
  },
]

interface SettingsSidebarProps {
  children: React.ReactNode
}

export function SettingsSidebar({ children }: SettingsSidebarProps) {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Manage your application settings and preferences</SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <SidebarMenu>
            {settingsMenuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.href} onClick={() => setOpen(false)}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          {/* User Account Section */}
          <div className="mt-8 pt-4 border-t">
            <div className="px-2 py-2">
              <p className="text-sm font-medium text-muted-foreground mb-2">Account</p>
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-2"
                onClick={() => {
                  setOpen(false)
                  // Navigate to user profile
                  window.location.href = "/admin/profile"
                }}
              >
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                  <AvatarFallback>
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
