import { prisma } from './prisma'

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    // Limit length
    .substring(0, 100)
}

/**
 * Ensure article slug is unique by appending numbers if needed
 */
export async function ensureUniqueArticleSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.article.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } })
      }
    })

    if (!existing) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

/**
 * Ensure category slug is unique
 */
export async function ensureUniqueCategorySlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.category.findFirst({
      where: {
        slug,
        ...(excludeId && { id: { not: excludeId } })
      }
    })

    if (!existing) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

/**
 * Generate category-based URL path
 */
export function generateArticleUrl(categorySlug: string, articleSlug: string): string {
  return `/${categorySlug}/${articleSlug}`
}

/**
 * Parse article URL to extract category and article slugs
 */
export function parseArticleUrl(url: string): { categorySlug: string; articleSlug: string } | null {
  const match = url.match(/^\/([^\/]+)\/([^\/]+)$/)
  if (!match) return null
  
  return {
    categorySlug: match[1],
    articleSlug: match[2]
  }
}

/**
 * Validate slug format
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}