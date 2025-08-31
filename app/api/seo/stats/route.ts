import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [totalPages, missingMeta, pendingSuggestions, criticalIssues] = await Promise.all([
      prisma.article.count({ where: { status: 'PUBLISHED' } }),
      prisma.article.count({ 
        where: { 
          status: 'PUBLISHED',
          OR: [
            { meta_description: null },
            { meta_description: '' }
          ]
        }
      }),
      prisma.metaSuggestion.count({ where: { status: 'PENDING' } }),
      prisma.seoIssue.count({ where: { severity: 'CRITICAL', resolved: false } })
    ])

    return NextResponse.json({
      totalPages,
      missingMeta,
      pendingSuggestions,
      criticalIssues
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}