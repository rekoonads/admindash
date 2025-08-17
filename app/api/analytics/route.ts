import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days

    // Get article stats
    const totalArticles = await prisma.article.count()
    const publishedArticles = await prisma.article.count({
      where: { status: 'PUBLISHED' }
    })
    const draftArticles = await prisma.article.count({
      where: { status: 'DRAFT' }
    })

    // Get total views
    const totalViews = await prisma.article.aggregate({
      _sum: { views_count: true }
    })

    // Get top articles by views
    const topArticles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views_count: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        views_count: true,
        category_id: true,
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    })

    // Get articles by category
    const articlesByCategory = await prisma.article.groupBy({
      by: ['category_id'],
      _count: { id: true }
    })

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalArticles,
          publishedArticles,
          draftArticles,
          totalViews: totalViews._sum.views_count || 0
        },
        topArticles,
        articlesByCategory
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch analytics'
    }, { status: 500 })
  }
}