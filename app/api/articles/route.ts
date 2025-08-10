import { NextRequest, NextResponse } from 'next/server'
import { createArticle, getArticles } from '@/lib/actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filters = {
      status: searchParams.get('status') || undefined,
      category: searchParams.get('category') || undefined,
      type: searchParams.get('type') || undefined,
      platform: searchParams.get('platform') || undefined,
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    }

    const articles = await getArticles(filters)
    
    // Return in consistent format
    return NextResponse.json({
      success: true,
      articles: articles,
      total: articles.length
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch articles',
      articles: []
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const article = await createArticle(formData)
    return NextResponse.json({
      success: true,
      article: article
    })
  } catch (error) {
    console.error('API Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to create article'
    return NextResponse.json({ 
      success: false,
      error: errorMessage
    }, { status: 500 })
  }
}