import { NextRequest, NextResponse } from 'next/server'
import { getArticles } from '@/lib/actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      type: 'VIDEO',
      category: 'gaming',
      status: searchParams.get('status') || 'PUBLISHED',
      platform: searchParams.get('platform') || undefined,
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
      error: 'Failed to fetch gaming videos',
      articles: []
    }, { status: 500 })
  }
}