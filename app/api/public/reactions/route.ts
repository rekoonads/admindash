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
    const { userId } = await auth()

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID required' }, { status: 400 })
    }

    const reactions = await prisma.reaction.groupBy({
      by: ['type'],
      where: { article_id: articleId },
      _count: { type: true }
    })

    let userReactions: any[] = []
    if (userId) {
      const user = await prisma.user.findUnique({ where: { clerk_id: userId } })
      if (user) {
        userReactions = await prisma.reaction.findMany({
          where: { article_id: articleId, user_id: user.id }
        })
      }
    }

    const formattedReactions = reactions.map(r => ({
      type: r.type,
      count: r._count.type,
      userReacted: userReactions.some(ur => ur.type === r.type)
    }))

    return NextResponse.json(formattedReactions, {
      headers: {
        'Access-Control-Allow-Origin': 'https://koodos.in',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  } catch (error) {
    console.error('Reactions API error:', error)
    return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    const { type, articleId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    if (!type || !articleId) {
      return NextResponse.json({ error: 'Type and article ID required' }, { status: 400 })
    }

    let user = await prisma.user.findUnique({ where: { clerk_id: userId } })
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

    const existingReaction = await prisma.reaction.findUnique({
      where: {
        user_id_article_id: {
          user_id: user.id,
          article_id: articleId
        }
      }
    })

    if (existingReaction) {
      await prisma.reaction.delete({ where: { id: existingReaction.id } })
    } else {
      await prisma.reaction.create({
        data: {
          type: type as any,
          user_id: user.id,
          article_id: articleId
        }
      })
    }

    return NextResponse.json({ success: true }, {
      headers: {
        'Access-Control-Allow-Origin': 'https://koodos.in',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  } catch (error) {
    console.error('Reaction creation error:', error)
    return NextResponse.json({ error: 'Failed to create reaction' }, { status: 500 })
  }
}