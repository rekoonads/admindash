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
    }

    const articles = await getArticles(filters)
    return NextResponse.json(articles)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const article = await createArticle(formData)
    return NextResponse.json(article)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}