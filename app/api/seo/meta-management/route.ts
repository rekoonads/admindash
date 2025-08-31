import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: { category: true },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json({ articles })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, meta_description } = await request.json()
    
    const updated = await prisma.article.update({
      where: { id },
      data: { meta_description }
    })

    return NextResponse.json({ success: true, article: updated })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update meta' }, { status: 500 })
  }
}