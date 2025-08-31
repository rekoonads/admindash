import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const status = searchParams.get('status')

  const where = status ? { status: status as any } : {}
  
  const [pages, total] = await Promise.all([
    prisma.seoPage.findMany({
      where,
      include: {
        suggestions: { where: { status: 'PENDING' } },
        issues: { where: { resolved: false } }
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { last_crawled: 'desc' }
    }),
    prisma.seoPage.count({ where })
  ])

  return NextResponse.json({ pages, total, page, limit })
}