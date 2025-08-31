import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { title, content, articleId } = await request.json()

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }

    // Mock AI generation - replace with actual AI service
    const seoTitle = `${title} - Complete Guide & Analysis | Koodos`
    const metaDescription = `${title}: Comprehensive review and analysis. Discover everything you need to know about ${title.toLowerCase()} with expert insights and detailed coverage.`
    const keywords = [
      'gaming',
      'review', 
      'guide',
      'analysis',
      title.toLowerCase().split(' ')[0],
      'nintendo',
      'entertainment'
    ].filter(Boolean).slice(0, 6)

    return NextResponse.json({
      success: true,
      seoTitle,
      metaDescription,
      keywords
    })
  } catch (error) {
    console.error('SEO generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate SEO content' },
      { status: 500 }
    )
  }
}