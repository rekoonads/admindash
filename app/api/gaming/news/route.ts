import { NextRequest, NextResponse } from 'next/server'
import { getArticles } from '@/lib/actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      type: 'NEWS',
      category: 'gaming',
      status: searchParams.get('status') || 'PUBLISHED',
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    }

    const articles = await getArticles(filters)
    
    return NextResponse.json({
      success: true,
      articles: articles,
      total: articles.length
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch gaming news',
      articles: []
    }, { status: 500 })
  }
}