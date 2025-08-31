import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { 
        status: 'PUBLISHED',
        OR: [
          { meta_description: null },
          { meta_description: '' },
          { meta_description: { contains: '' } }
        ]
      },
      include: { category: true },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json({ articles })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 })
  }
}