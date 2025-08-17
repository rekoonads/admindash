import { NextRequest, NextResponse } from 'next/server'
import { updateArticleStatus } from '@/lib/actions'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await updateArticleStatus(id, 'DRAFT')
    return NextResponse.json({ success: true, message: 'Article saved as draft' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 })
  }
}