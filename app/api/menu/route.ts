import { NextResponse } from 'next/server'

interface MenuItem {
  id: string
  name: string
  href: string
  icon?: string
  order: number
  isActive: boolean
  isExternal: boolean
  parentId?: string
  location: 'navbar' | 'footer'
  children?: MenuItem[]
}

function buildHierarchy(items: MenuItem[]): MenuItem[] {
  const itemMap = new Map(items.map(item => [item.id, { ...item, children: [] }]))
  const result: MenuItem[] = []

  items.forEach(item => {
    const menuItem = itemMap.get(item.id)!
    if (item.parentId && itemMap.has(item.parentId)) {
      itemMap.get(item.parentId)!.children!.push(menuItem)
    } else {
      result.push(menuItem)
    }
  })

  return result.sort((a, b) => a.order - b.order)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location') as 'navbar' | 'footer' | null

    // Default navbar items for frontend
    const navbarItems: MenuItem[] = [
      { id: "nav-1", name: "Home", href: "/", icon: "Home", order: 1, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-2", name: "Latest Updates", href: "/latest-updates", icon: "Newspaper", order: 2, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-3", name: "Reviews", href: "/reviews", icon: "Star", order: 3, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-3-1", name: "All Reviews", href: "/reviews", icon: "Star", order: 1, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-3" },
      { id: "nav-3-2", name: "Game Reviews", href: "/reviews/games", icon: "Gamepad2", order: 2, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-3" },
      { id: "nav-3-3", name: "Movie Reviews", href: "/reviews/movies", icon: "Video", order: 3, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-3" },
      { id: "nav-3-4", name: "TV Reviews", href: "/reviews/tv", icon: "Monitor", order: 4, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-3" },
      { id: "nav-3-5", name: "Comic Reviews", href: "/reviews/comics", icon: "BookOpen", order: 5, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-3" },
      { id: "nav-3-6", name: "Tech Reviews", href: "/reviews/tech", icon: "Monitor", order: 6, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-3" },
      { id: "nav-4", name: "Interviews", href: "/interviews", icon: "MessageCircle", order: 4, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-5", name: "Spotlights", href: "/spotlights", icon: "Star", order: 5, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-6", name: "Top Lists", href: "/top-lists", icon: "List", order: 6, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-7", name: "Opinions", href: "/opinions", icon: "MessageCircle", order: 7, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-8", name: "Guides", href: "/guides", icon: "BookOpen", order: 8, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-9", name: "Wiki", href: "/wiki", icon: "BookOpen", order: 9, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-10", name: "Videos", href: "/videos", icon: "Video", order: 10, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-11", name: "Gaming", href: "/gaming", icon: "Gamepad2", order: 11, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-11-1", name: "Nintendo", href: "/gaming/nintendo", icon: "Gamepad2", order: 1, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-11" },
      { id: "nav-11-2", name: "Xbox", href: "/gaming/xbox", icon: "Gamepad2", order: 2, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-11" },
      { id: "nav-11-3", name: "PlayStation", href: "/gaming/playstation", icon: "Gamepad2", order: 3, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-11" },
      { id: "nav-11-4", name: "PC", href: "/gaming/pc", icon: "Monitor", order: 4, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-11" },
      { id: "nav-11-5", name: "Mobile", href: "/gaming/mobile", icon: "Phone", order: 5, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-11" },
      { id: "nav-12", name: "Tech", href: "/tech", icon: "Monitor", order: 12, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-13", name: "Anime & Manga", href: "/anime-manga", icon: "Star", order: 13, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-13-1", name: "All Anime Coverage", href: "/anime-manga/anime", icon: "Video", order: 1, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-13" },
      { id: "nav-13-2", name: "Cosplay", href: "/anime-manga/cosplay", icon: "Star", order: 2, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-13" },
      { id: "nav-14", name: "Science & Comics", href: "/science-comics", icon: "BookOpen", order: 14, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-15", name: "Follow Koodos", href: "/follow", icon: "Star", order: 15, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-15-1", name: "Social Media Links", href: "/follow/social", icon: "Star", order: 1, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-15" },
      { id: "nav-15-2", name: "Newsletter", href: "/follow/newsletter", icon: "MessageCircle", order: 2, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-15" },
      { id: "nav-16", name: "More", href: "/more", icon: "List", order: 16, isActive: true, isExternal: false, location: 'navbar' },
      { id: "nav-16-1", name: "About Koodos", href: "/more/about", icon: "Home", order: 1, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
      { id: "nav-16-2", name: "Contact Editorial Team", href: "/more/contact", icon: "MessageCircle", order: 2, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
      { id: "nav-16-3", name: "Advertise With Us", href: "/more/advertise", icon: "Star", order: 3, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
      { id: "nav-16-4", name: "Press", href: "/more/press", icon: "BookOpen", order: 4, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
      { id: "nav-16-5", name: "User Agreement", href: "/more/terms", icon: "BookOpen", order: 5, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
      { id: "nav-16-6", name: "Privacy Policy", href: "/more/privacy", icon: "BookOpen", order: 6, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
      { id: "nav-16-7", name: "Cookie Policy", href: "/more/cookies", icon: "BookOpen", order: 7, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
      { id: "nav-16-8", name: "RSS", href: "/more/rss", icon: "BookOpen", order: 8, isActive: true, isExternal: false, location: 'navbar', parentId: "nav-16" },
    ]

    let items = navbarItems
    if (location) {
      items = items.filter(item => item.location === location)
    }

    const hierarchicalItems = buildHierarchy(items)

    return NextResponse.json({
      success: true,
      data: hierarchicalItems
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch menu items' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const menuItems = await request.json()
    
    return NextResponse.json({
      success: true,
      message: 'Menu items saved successfully'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save menu items' },
      { status: 500 }
    )
  }
}