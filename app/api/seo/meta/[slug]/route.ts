import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    
    const page = await prisma.seoPage.findFirst({
      where: {
        OR: [
          { url: { contains: slug } },
          { url: { endsWith: `/${slug}` } }
        ]
      },
      include: {
        suggestions: {
          where: { status: 'APPROVED' },
          orderBy: { created_at: 'desc' },
          take: 1
        }
      }
    })

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    const approvedSuggestion = page.suggestions[0]
    
    return NextResponse.json({
      title: page.title,
      current_meta: page.current_meta,
      meta_description: approvedSuggestion?.suggestion || page.current_meta,
      keywords: approvedSuggestion?.keywords || [],
      url: page.url
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch meta' }, { status: 500 })
  }
}