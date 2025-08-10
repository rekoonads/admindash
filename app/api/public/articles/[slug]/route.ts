import { NextRequest, NextResponse } from 'next/server'
import { getArticleBySlug } from '@/lib/actions'

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
  { params }: { params: { slug: string } }
) {
  try {
    const article = await getArticleBySlug(params.slug)
    
    if (!article) {
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
    
    return NextResponse.json(article, {
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