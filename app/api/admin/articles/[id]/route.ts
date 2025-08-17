import { NextRequest, NextResponse } from 'next/server'
import { updateArticleStatus } from '@/lib/actions'

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { status } = await request.json()
    await updateArticleStatus(id, status)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin article PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}