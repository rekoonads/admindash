"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Banner {
  id: string
  title: string
  imageUrl: string
  linkUrl: string
  page: string
  position: "top" | "middle" | "bottom"
  isActive: boolean
}

interface BannerDisplayProps {
  page: string
  position: "top" | "middle" | "bottom"
}

export function BannerDisplay({ page, position }: BannerDisplayProps) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([])

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockBanners: Banner[] = [
      {
        id: "1",
        title: "Gaming Sale Banner",
        imageUrl: "/placeholder.jpg",
        linkUrl: "https://example.com/sale",
        page: "news",
        position: "top",
        isActive: true,
      },
      {
        id: "2",
        title: "All Pages Banner",
        imageUrl: "/placeholder.jpg",
        linkUrl: "https://example.com/promo",
        page: "all",
        position: "middle",
        isActive: true,
      },
    ]

    const filteredBanners = mockBanners.filter(banner => 
      banner.isActive && 
      (banner.page === page || banner.page === "all") &&
      banner.position === position &&
      !dismissedBanners.includes(banner.id)
    )

    setBanners(filteredBanners)
  }, [page, position, dismissedBanners])

  const dismissBanner = (bannerId: string) => {
    setDismissedBanners(prev => [...prev, bannerId])
  }

  if (banners.length === 0) return null

  return (
    <div className="space-y-4">
      {banners.map((banner) => (
        <Card key={banner.id} className="relative overflow-hidden">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 z-10 h-6 w-6 p-0"
            onClick={() => dismissBanner(banner.id)}
          >
            <X className="h-4 w-4" />
          </Button>
          <a
            href={banner.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <div className="aspect-[4/1] bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white">
              <div className="text-center">
                <h3 className="text-xl font-bold">{banner.title}</h3>
                <p className="text-sm opacity-90">Click to learn more</p>
              </div>
            </div>
          </a>
        </Card>
      ))}
    </div>
  )
}