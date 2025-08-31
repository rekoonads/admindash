import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedCategories() {
  const categories = [
    { name: 'Reviews', slug: 'reviews', description: 'Game, movie, and tech reviews' },
    { name: 'Game Reviews', slug: 'game-reviews', description: 'Video game reviews and ratings' },
    { name: 'Movie Reviews', slug: 'movie-reviews', description: 'Movie reviews and ratings' },
    { name: 'TV Reviews', slug: 'tv-reviews', description: 'TV show reviews and ratings' },
    { name: 'Tech Reviews', slug: 'tech-reviews', description: 'Technology product reviews' },
    { name: 'Comic Reviews', slug: 'comic-reviews', description: 'Comic book reviews' },
    { name: 'Latest Updates', slug: 'latest-updates', description: 'Latest news and updates' },
    { name: 'Interviews', slug: 'interviews', description: 'Exclusive interviews' },
    { name: 'Spotlights', slug: 'spotlights', description: 'Featured content spotlights' },
    { name: 'Top Lists', slug: 'top-lists', description: 'Top 10 lists and rankings' },
    { name: 'Opinions', slug: 'opinions', description: 'Editorial opinions and commentary' },
    { name: 'Guides', slug: 'guides', description: 'How-to guides and tutorials' },
    { name: 'Videos', slug: 'videos', description: 'Video content' },
    { name: 'Gaming', slug: 'gaming', description: 'Gaming news and content' },
    { name: 'Tech', slug: 'tech', description: 'Technology news and reviews' },
    { name: 'Anime', slug: 'anime', description: 'Anime coverage and reviews' },
    { name: 'Science', slug: 'science', description: 'Science and comics content' }
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

seedCategories()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })