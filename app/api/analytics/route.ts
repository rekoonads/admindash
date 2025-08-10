import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
      _sum: { views: true }
    })

    // Get top articles by views
    const topArticles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { views: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        views: true,
        category: { select: { name: true } }
      }
    })

    // Get articles by category
    const articlesByCategory = await prisma.article.groupBy({
      by: ['categoryId'],
      _count: { id: true },
      include: {
        category: { select: { name: true } }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalArticles,
          publishedArticles,
          draftArticles,
          totalViews: totalViews._sum.views || 0
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