import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const source = searchParams.get('source')
    
    if (!query) {
      return NextResponse.json({ error: 'Search query required' }, { status: 400 })
    }

    // Web search endpoints
    if (source === 'google') {
      const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=10`
      const response = await fetch(url)
      const data = await response.json()
      const results = data.items?.map((item: any) => ({
        title: item.title,
        snippet: item.snippet,
        link: item.link
      })) || []
      return NextResponse.json({ results })
    }

    if (source === 'duckduckgo') {
      const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
      const response = await fetch(url)
      const data = await response.json()
      const results = data.RelatedTopics?.slice(0, 10).map((item: any) => ({
        title: item.Text?.split(' - ')[0] || '',
        snippet: item.Text || '',
        link: item.FirstURL || ''
      })) || []
      return NextResponse.json({ results })
    }

    if (source === 'wikipedia') {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`
      const response = await fetch(url)
      const data = await response.json()
      return NextResponse.json({ extract: data.extract || '' })
    }

    // Default local search
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