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
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        display_name: true,
        email: true,
        role: true,
        created_at: true,
        _count: {
          select: {
            articles: true,
            comments: true,
            reactions: true
          }
        }
      }
    })

    // Transform data to match frontend expectations
    const transformedUsers = users.map(user => ({
      ...user,
      name: user.display_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User',
      createdAt: user.created_at
    }))

    const totalUsers = await prisma.user.count()

    return NextResponse.json({
      success: true,
      users: transformedUsers,
      total: totalUsers
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch users'
    }, { status: 500 })
  }
}