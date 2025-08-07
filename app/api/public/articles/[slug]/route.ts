import { NextRequest, NextResponse } from 'next/server'
import { getArticleBySlug } from '@/lib/actions'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const article = await getArticleBySlug(params.slug)
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json(article, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Public article API error:', error)
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 })
  }
}