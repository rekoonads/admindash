import { prisma } from './prisma'

export async function analyzeSeoIssues() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true }
  })

  const issues = []

  for (const article of articles) {
    // Missing meta description
    if (!article.meta_description) {
      issues.push({
        articleId: article.id,
        type: 'MISSING_META',
        severity: 'HIGH',
        description: 'Article has no meta description'
      })
    }

    // Meta description too long
    if (article.meta_description && article.meta_description.length > 160) {
      issues.push({
        articleId: article.id,
        type: 'TOO_LONG',
        severity: 'MEDIUM',
        description: `Meta description is ${article.meta_description.length} characters (max 160)`
      })
    }

    // Meta description too short
    if (article.meta_description && article.meta_description.length < 120) {
      issues.push({
        articleId: article.id,
        type: 'TOO_SHORT',
        severity: 'LOW',
        description: `Meta description is ${article.meta_description.length} characters (min 120)`
      })
    }

    // Missing title
    if (!article.title) {
      issues.push({
        articleId: article.id,
        type: 'MISSING_TITLE',
        severity: 'CRITICAL',
        description: 'Article has no title'
      })
    }
  }

  return issues
}

export async function generateBulkMeta(articleIds: string[]) {
  const results = []

  for (const id of articleIds) {
    try {
      const response = await fetch('/api/seo/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: id })
      })
      
      if (response.ok) {
        results.push({ id, status: 'success' })
      } else {
        results.push({ id, status: 'failed' })
      }
    } catch (error) {
      results.push({ id, status: 'error', error: error.message })
    }
  }

  return results
}