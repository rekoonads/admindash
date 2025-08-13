import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories
  const categories = [
    { name: 'Latest News', slug: 'latest-news', description: 'Latest gaming news and updates' },
    { name: 'Reviews', slug: 'reviews', description: 'Game and hardware reviews' },
    { name: 'Game Guides', slug: 'game-guides', description: 'Gaming guides and tutorials' },
    { name: 'Tech News', slug: 'tech-news', description: 'Technology news and updates' },
    { name: 'Video Content', slug: 'video-content', description: 'Gaming videos and streams' },
    { name: 'Anime', slug: 'anime', description: 'Anime news and reviews' },
    { name: 'Comics', slug: 'comics', description: 'Comic book news and reviews' },
    { name: 'Esports', slug: 'esports', description: 'Esports news and tournaments' },
    { name: 'PC Gaming', slug: 'pc-gaming', description: 'PC gaming content' },
    { name: 'PlayStation 5', slug: 'playstation-5', description: 'PS5 gaming content' },
    { name: 'Xbox', slug: 'xbox', description: 'Xbox gaming content' },
    { name: 'Nintendo Switch', slug: 'nintendo-switch', description: 'Nintendo Switch content' },
    { name: 'Mobile Gaming', slug: 'mobile-gaming', description: 'Mobile gaming content' },
    { name: 'Science', slug: 'science', description: 'Science and technology' }
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  console.log('Categories seeded successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })