import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    
    if (!query) {
      return NextResponse.json({ error: 'Search query required' }, { status: 400 })
    }

    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
          { game_title: { contains: query, mode: 'insensitive' } },
        ],
        status: 'PUBLISHED'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featured_image: true,
        category: true,
        type: true,
        published_at: true
      },
      take: 20
    })

    return NextResponse.json(articles)
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}