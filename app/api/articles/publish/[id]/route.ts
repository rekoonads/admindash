import { NextRequest, NextResponse } from 'next/server'
import { updateArticleStatus } from '@/lib/actions'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await updateArticleStatus(id, 'PUBLISHED')
    return NextResponse.json({ success: true, message: 'Article published successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to publish article' }, { status: 500 })
  }
}