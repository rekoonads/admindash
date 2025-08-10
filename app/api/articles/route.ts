import { NextRequest, NextResponse } from 'next/server'
import { getArticles } from '@/lib/actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || undefined
    const category = searchParams.get('category') || undefined
    const type = searchParams.get('type') || undefined
    const search = searchParams.get('search') || undefined
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

    const articles = await getArticles({
      status,
      category,
      type,
      search,
      limit
    })
    
    return NextResponse.json(articles)
  } catch (error) {
    console.error('Articles API error:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}