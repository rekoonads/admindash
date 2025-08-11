import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth, currentUser } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://koodos.in',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const articleId = searchParams.get('articleId')

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID required' }, { status: 400 })
    }

    const comments = await prisma.comment.findMany({
      where: { article_id: articleId },
      orderBy: { created_at: 'desc' },
      take: 50
    })

    return NextResponse.json(comments, {
      headers: {
        'Access-Control-Allow-Origin': 'https://koodos.in',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  } catch (error) {
    console.error('Comments API error:', error)
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const { content, articleId, author } = await request.json()

    if (!content || !articleId) {
      return NextResponse.json({ error: 'Content and article ID required' }, { status: 400 })
    }

    let user
    if (userId) {
      user = await prisma.user.findUnique({ where: { clerk_id: userId } })
      if (!user) {
        const clerkUser = await currentUser()
        user = await prisma.user.create({
          data: {
            clerk_id: userId,
            email: clerkUser?.emailAddresses[0]?.emailAddress || 'user@example.com',
            first_name: clerkUser?.firstName || 'User',
            last_name: clerkUser?.lastName || '',
            role: 'AUTHOR'
          }
        })
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        article_id: articleId,
        author: author || 'Anonymous',
        user_id: user?.id || 'anonymous',
        email: user?.email
      }
    })

    return NextResponse.json(comment, {
      headers: {
        'Access-Control-Allow-Origin': 'https://koodos.in',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  } catch (error) {
    console.error('Comment creation error:', error)
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 })
  }
}