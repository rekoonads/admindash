import { NextRequest, NextResponse } from 'next/server'
import { updateArticleStatus } from '@/lib/actions'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await request.json()
    await updateArticleStatus(params.id, status)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin article PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}