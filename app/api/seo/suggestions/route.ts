import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateMetaDescription } from '@/lib/ai-meta-generator'

export async function POST(request: NextRequest) {
  try {
    const { pageId } = await request.json()
    
    const page = await prisma.seoPage.findUnique({
      where: { id: pageId }
    })

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    const suggestion = await generateMetaDescription(page)
    
    const created = await prisma.metaSuggestion.create({
      data: {
        page_id: pageId,
        suggestion: suggestion.text,
        keywords: suggestion.keywords,
        confidence: suggestion.confidence
      }
    })

    return NextResponse.json(created)
  } catch (error) {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, editedText, approvedBy } = await request.json()
    
    const updated = await prisma.metaSuggestion.update({
      where: { id },
      data: {
        status,
        edited_text: editedText,
        approved_by: approvedBy
      }
    })

    if (status === 'APPROVED' || status === 'EDITED') {
      const finalText = editedText || updated.suggestion
      await prisma.seoPage.update({
        where: { id: updated.page_id },
        data: { current_meta: finalText }
      })
    }

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}