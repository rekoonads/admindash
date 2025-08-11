"use client"

import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { UserButton, useUser } from "@clerk/nextjs"
import { useIsMobile } from "@/components/ui/use-mobile"
import { useState } from "react"
import Link from "next/link"

export function DashboardHeader() {
  const isMobile = useIsMobile()
  const { user } = useUser()
  const [searchQuery, setSearchQuery] = useState("")
  
  const handleSearch = async (query: string) => {
    if (!query.trim()) return
    
    try {
      const response = await fetch(`/api/articles?search=${encodeURIComponent(query)}`)
      const results = await response.json()
      console.log('Search results:', results)
    } catch (error) {
      console.error('Search error:', error)
    }
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery)
    }
  }

  return (
    <header className={`flex ${isMobile ? 'h-14' : 'h-16'} shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b ${isMobile ? 'px-2' : 'px-4'}`}>
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <span className={`${isMobile ? 'text-base' : 'text-lg'} text-black font-bold`}>Dashboard</span>
        </Link>
      </div>

      {!isMobile && (
        <div className="flex-1 max-w-md ml-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search articles, reviews, guides..." 
              className="pl-8 bg-background" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 ml-auto">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => handleSearch(searchQuery)}>
            <Search className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">3</Badge>
        </Button>
        
        {!isMobile && user && (
          <span className="text-sm text-muted-foreground mr-2">
            {user.firstName || user.username || 'User'}
          </span>
        )}
        <UserButton afterSignOutUrl="/sign-in" />
      </div>
    </header>
  )
}