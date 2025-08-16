import { prisma } from '@/lib/prisma'

// Generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Ensure unique category slug
export async function ensureUniqueCategorySlug(
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.category.findUnique({
      where: { slug },
      select: { id: true }
    })

    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

// Ensure unique article slug
export async function ensureUniqueArticleSlug(
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.article.findUnique({
      where: { slug },
      select: { id: true }
    })

    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export function getContentTypeFromPath(path: string): string {
  const pathMap: Record<string, string> = {
    '/latest-updates': 'NEWS',
    '/reviews': 'REVIEW',
    '/reviews/games': 'GAME_REVIEW',
    '/reviews/movies': 'MOVIE_REVIEW',
    '/reviews/tv': 'TV_REVIEW',
    '/reviews/comics': 'COMIC_REVIEW',
    '/reviews/tech': 'TECH_REVIEW',
    '/interviews': 'INTERVIEW',
    '/spotlights': 'SPOTLIGHT',
    '/top-lists': 'LIST',
    '/opinions': 'OPINION',
    '/guides': 'GUIDE',
    '/wiki': 'WIKI',
    '/videos': 'VIDEO',
    '/anime-manga': 'ANIME',
    '/anime-manga/anime': 'ANIME',
    '/anime-manga/cosplay': 'COSPLAY',
    '/science-comics': 'SCIENCE',
    '/tech': 'TECH'
  }
  
  return pathMap[path] || 'NEWS'
}