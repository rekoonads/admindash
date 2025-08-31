import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { crawlWebsite } from '@/lib/seo-crawler'

export async function POST(request: NextRequest) {
  try {
    const { baseUrl, maxPages = 50 } = await request.json()
    
    const job = await prisma.crawlJob.create({
      data: { status: 'RUNNING' }
    })

    crawlWebsite(baseUrl, maxPages, job.id).catch(console.error)

    return NextResponse.json({ jobId: job.id, status: 'started' })
  } catch (error) {
    return NextResponse.json({ error: 'Crawl failed' }, { status: 500 })
  }
}

export async function GET() {
  const jobs = await prisma.crawlJob.findMany({
    orderBy: { created_at: 'desc' },
    take: 10
  })
  return NextResponse.json(jobs)
}