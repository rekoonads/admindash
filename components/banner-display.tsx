"use client"

import { getBannerImageUrl } from "@/lib/cloudinary";

interface BannerDisplayProps {
  page: string
  position: 'top' | 'bottom' | 'sidebar'
}

export function BannerDisplay({ page, position }: BannerDisplayProps) {
  // Mock banner data - replace with actual API call
  const banners = [
    {
      id: '1',
      title: 'Gaming Sale 2024',
      content: 'Up to 70% off on top gaming titles',
      imageUrl: getBannerImageUrl('sample'),
      linkUrl: 'https://koodos.in/sale',
      position: 'TOP',
      page: 'home',
      isActive: true
    }
  ]

  const activeBanners = banners.filter(banner => 
    banner.isActive && 
    banner.page === page && 
    banner.position.toLowerCase() === position.toLowerCase()
  )

  if (activeBanners.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {activeBanners.map((banner) => (
        <div key={banner.id} className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">{banner.title}</h3>
            <p className="text-blue-100 mb-4">{banner.content}</p>
            {banner.linkUrl && (
              <a
                href={banner.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-blue-600 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors"
              >
                Learn More
              </a>
            )}
          </div>
          {banner.imageUrl && (
            <div className="absolute inset-0 opacity-20">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}