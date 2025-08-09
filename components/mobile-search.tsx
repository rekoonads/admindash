"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function MobileSearch() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-auto">
        <SheetHeader>
          <SheetTitle>Search</SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search articles, reviews, guides..." 
              className="pl-8" 
              autoFocus
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}