import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create categories matching frontend menu structure
  const categories = [
    { name: 'Latest Updates', slug: 'latest-updates', description: 'Breaking news and updates' },
    { name: 'Game Reviews', slug: 'game-reviews', description: 'Video game reviews and ratings' },
    { name: 'Movie Reviews', slug: 'movie-reviews', description: 'Movie reviews and ratings' },
    { name: 'TV Reviews', slug: 'tv-reviews', description: 'TV show reviews and ratings' },
    { name: 'Comic Reviews', slug: 'comic-reviews', description: 'Comic book reviews' },
    { name: 'Tech Reviews', slug: 'tech-reviews', description: 'Technology product reviews' },
    { name: 'Interviews', slug: 'interviews', description: 'Exclusive interviews' },
    { name: 'Spotlights', slug: 'spotlights', description: 'Featured content and spotlights' },
    { name: 'Top Lists', slug: 'top-lists', description: 'Curated top lists' },
    { name: 'Opinions', slug: 'opinions', description: 'Editorial opinions and commentary' },
    { name: 'Guides', slug: 'guides', description: 'How-to guides and tutorials' },
    { name: 'Wiki', slug: 'wiki', description: 'Knowledge base articles' },
    { name: 'Videos', slug: 'videos', description: 'Video content' },
    { name: 'Nintendo', slug: 'nintendo', description: 'Nintendo gaming content' },
    { name: 'Xbox', slug: 'xbox', description: 'Xbox gaming content' },
    { name: 'PlayStation', slug: 'playstation', description: 'PlayStation gaming content' },
    { name: 'PC Gaming', slug: 'pc-gaming', description: 'PC gaming content' },
    { name: 'Mobile Gaming', slug: 'mobile-gaming', description: 'Mobile gaming content' },
    { name: 'Tech', slug: 'tech', description: 'Technology news and reviews' },
    { name: 'Anime', slug: 'anime', description: 'Anime coverage and reviews' },
    { name: 'Manga', slug: 'manga', description: 'Manga coverage and reviews' },
    { name: 'Cosplay', slug: 'cosplay', description: 'Cosplay features and galleries' },
    { name: 'Science', slug: 'science', description: 'Science news and articles' },
    { name: 'Comics', slug: 'comics', description: 'Comic book coverage' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
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