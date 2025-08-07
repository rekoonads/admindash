import { NextRequest, NextResponse } from 'next/server'
import { getPublishedArticles } from '@/lib/actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || undefined
    const type = searchParams.get('type') || undefined

    const articles = await getPublishedArticles(category, type)
    
    return NextResponse.json(articles, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Public articles API error:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}