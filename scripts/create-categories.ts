import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  { name: 'Latest News', slug: 'latest-news', description: 'Breaking news and updates' },
  { name: 'Reviews', slug: 'reviews', description: 'Game and product reviews' },
  { name: 'Game Guides', slug: 'game-guides', description: 'Gaming guides and tutorials' },
  { name: 'Tech News', slug: 'tech-news', description: 'Technology news and updates' },
  { name: 'Video Content', slug: 'video-content', description: 'Video articles and content' },
  { name: 'Anime', slug: 'anime', description: 'Anime news and reviews' },
  { name: 'Comics', slug: 'comics', description: 'Comic book news and reviews' },
  { name: 'Esports', slug: 'esports', description: 'Esports news and tournaments' },
  { name: 'PC Gaming', slug: 'pc-gaming', description: 'PC gaming news and reviews' },
  { name: 'PlayStation 5', slug: 'playstation-5', description: 'PS5 games and news' },
  { name: 'Xbox', slug: 'xbox', description: 'Xbox games and news' },
  { name: 'Nintendo Switch', slug: 'nintendo-switch', description: 'Nintendo Switch games and news' },
  { name: 'Mobile Gaming', slug: 'mobile-gaming', description: 'Mobile games and apps' },
  { name: 'Science', slug: 'science', description: 'Science and technology articles' }
]

async function createCategories() {
  console.log('🚀 Creating categories...')
  
  for (const category of categories) {
    try {
      const existing = await prisma.category.findUnique({
        where: { slug: category.slug }
      })
      
      if (existing) {
        console.log(`✅ Category "${category.name}" already exists`)
      } else {
        await prisma.category.create({
          data: {
            ...category,
            is_active: true,
            sort_order: 0
          }
        })
        console.log(`✅ Created category "${category.name}" with slug "${category.slug}"`)
      }
    } catch (error) {
      console.error(`❌ Error creating category "${category.name}":`, error)
    }
  }
  
  console.log('✨ Category creation completed!')
  await prisma.$disconnect()
}

createCategories().catch((error) => {
  console.error('💥 Script failed:', error)
  process.exit(1)
})