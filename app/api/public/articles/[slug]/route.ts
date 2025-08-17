import { NextRequest, NextResponse } from 'next/server'
import { getArticleBySlug } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://koodos.in',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    console.log('Fetching article with slug:', slug)
    const article = await getArticleBySlug(slug)
    console.log('Article found:', !!article)
    
    if (!article) {
      console.log('Article not found for slug:', slug)
      return NextResponse.json({ error: 'Article not found' }, { 
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': 'https://koodos.in',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
        },
      })
    }
    
    // Transform the article to match expected format
    const transformedArticle = {
      id: article.id,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      featuredImage: article.featured_image,
      videoUrl: article.video_url,
      categoryId: article.category_id,
      author: article.author_name,
      views: article.views_count,
      slug: article.slug,
      tags: article.tags || [],
      createdAt: article.created_at,
      updatedAt: article.updated_at
    }
    
    return NextResponse.json(transformedArticle, {
      headers: {
        'Access-Control-Allow-Origin': 'https://koodos.in',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  } catch (error) {
    console.error('Public article API error:', error)
    return NextResponse.json({ error: 'Failed to fetch article' }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': 'https://koodos.in',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  }
}