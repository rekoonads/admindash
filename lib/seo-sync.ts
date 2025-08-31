import { prisma } from './prisma'

export async function syncArticleToSeo(articleId: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { category: true }
    })

    if (!article) return

    const url = `https://koodos.in/article/${article.category?.slug || 'news'}/${article.slug}`
    
    await prisma.seoPage.upsert({
      where: { url },
      update: {
        title: article.title,
        current_meta: article.meta_description || article.excerpt,
        content_preview: article.content.substring(0, 500),
        last_crawled: new Date()
      },
      create: {
        url,
        title: article.title,
        current_meta: article.meta_description || article.excerpt,
        content_preview: article.content.substring(0, 500)
      }
    })
  } catch (error) {
    console.error('SEO sync failed:', error)
  }
}

export async function bulkSyncArticles() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true }
  })

  for (const article of articles) {
    await syncArticleToSeo(article.id)
  }
}