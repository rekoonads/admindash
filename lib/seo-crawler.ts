import { prisma } from './prisma'

interface CrawlResult {
  url: string
  title: string
  metaDescription: string
  content: string
  headings: Record<string, string[]>
  wordCount: number
}

export async function crawlWebsite(baseUrl: string, maxPages: number, jobId: string) {
  try {
    await prisma.crawlJob.update({
      where: { id: jobId },
      data: { started_at: new Date() }
    })

    // Crawl only content pages from database
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true },
      take: maxPages
    })

    let crawled = 0
    for (const article of articles) {
      try {
        const url = `${baseUrl}/article/${article.category?.slug || 'news'}/${article.slug}`
        const result = await crawlArticlePage(article, url)
        await saveCrawlResult(result)
        crawled++

        await prisma.crawlJob.update({
          where: { id: jobId },
          data: { pages_crawled: crawled, pages_found: articles.length }
        })
      } catch (error) {
        console.error(`Failed to process article ${article.id}:`, error)
      }
    }

    await prisma.crawlJob.update({
      where: { id: jobId },
      data: { 
        status: 'COMPLETED',
        completed_at: new Date(),
        pages_crawled: crawled
      }
    })

  } catch (error) {
    await prisma.crawlJob.update({
      where: { id: jobId },
      data: { status: 'FAILED', errors: { message: error.message } }
    })
  }
}

async function crawlArticlePage(article: any, url: string): Promise<CrawlResult> {
  const content = article.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  
  return {
    url,
    title: article.title,
    metaDescription: article.meta_description || article.excerpt || '',
    content: content.substring(0, 500),
    headings: { h1: [article.title] },
    wordCount: content.split(' ').length
  }
}

async function saveCrawlResult(result: CrawlResult) {
  const issues = analyzeIssues(result)
  
  const page = await prisma.seoPage.upsert({
    where: { url: result.url },
    update: {
      title: result.title,
      current_meta: result.metaDescription,
      content_preview: result.content,
      headings: result.headings,
      word_count: result.wordCount,
      last_crawled: new Date()
    },
    create: {
      url: result.url,
      title: result.title,
      current_meta: result.metaDescription,
      content_preview: result.content,
      headings: result.headings,
      word_count: result.wordCount
    }
  })

  // Clear old issues and create new ones
  await prisma.seoIssue.deleteMany({ where: { page_id: page.id } })
  
  if (issues.length > 0) {
    await prisma.seoIssue.createMany({
      data: issues.map(issue => ({ ...issue, page_id: page.id }))
    })
  }
}

function analyzeIssues(result: CrawlResult) {
  const issues = []

  if (!result.metaDescription) {
    issues.push({ type: 'MISSING_META', severity: 'HIGH', description: 'Missing meta description' })
  } else if (result.metaDescription.length > 160) {
    issues.push({ type: 'TOO_LONG', severity: 'MEDIUM', description: 'Meta description too long' })
  } else if (result.metaDescription.length < 120) {
    issues.push({ type: 'TOO_SHORT', severity: 'LOW', description: 'Meta description too short' })
  }

  if (!result.title) {
    issues.push({ type: 'MISSING_TITLE', severity: 'CRITICAL', description: 'Missing page title' })
  }

  if (!result.headings.h1 || result.headings.h1.length === 0) {
    issues.push({ type: 'NO_H1', severity: 'HIGH', description: 'Missing H1 tag' })
  } else if (result.headings.h1.length > 1) {
    issues.push({ type: 'MULTIPLE_H1', severity: 'MEDIUM', description: 'Multiple H1 tags' })
  }

  return issues
}

