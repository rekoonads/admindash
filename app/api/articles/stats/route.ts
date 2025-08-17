import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      totalViews
    ] = await Promise.all([
      prisma.article.count(),
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.article.count({ where: { status: 'DRAFT' } }),
      prisma.article.aggregate({ _sum: { views_count: true } })
    ])

    const stats = {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalViews: totalViews._sum.views_count || 0
    }

    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}