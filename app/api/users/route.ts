import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50

    const users = await prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            articles: true,
            comments: true,
            likes: true
          }
        }
      }
    })

    const totalUsers = await prisma.user.count()

    return NextResponse.json({
      success: true,
      users,
      total: totalUsers
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch users'
    }, { status: 500 })
  }
}