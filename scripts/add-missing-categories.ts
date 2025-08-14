import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const missingCategories = [
  { name: 'Gaming', slug: 'gaming', description: 'General gaming news and content' },
  { name: 'News', slug: 'news', description: 'General news and updates' },
  { name: 'Entertainment', slug: 'entertainment', description: 'Entertainment news and content' },
  { name: 'Movies', slug: 'movies', description: 'Movie news and reviews' },
  { name: 'TV Shows', slug: 'tv-shows', description: 'TV show news and reviews' },
  { name: 'Music', slug: 'music', description: 'Music news and reviews' },
  { name: 'Sports', slug: 'sports', description: 'Sports news and updates' },
  { name: 'Lifestyle', slug: 'lifestyle', description: 'Lifestyle articles and tips' },
  { name: 'Health', slug: 'health', description: 'Health and wellness content' },
  { name: 'Food', slug: 'food', description: 'Food and cooking content' }
]

async function addMissingCategories() {
  console.log('🚀 Adding missing categories...')
  
  for (const category of missingCategories) {
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
  
  console.log('✨ Missing categories added!')
  await prisma.$disconnect()
}

addMissingCategories().catch((error) => {
  console.error('💥 Script failed:', error)
  process.exit(1)
})