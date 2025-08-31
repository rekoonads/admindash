import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { title, content, excerpt, metaTitle, metaDescription, keywords, webSources, generationId } = await request.json();
    
    console.log('Saving AI article:', title);
    
    const aiArticle = await prisma.aiArticle.create({
      data: {
        title,
        content,
        excerpt,
        meta_title: metaTitle,
        meta_description: metaDescription,
        keywords: keywords || [],
        tags: keywords || [],
        web_sources: webSources || 0,
        generation_id: generationId,
        status: 'GENERATED'
      }
    });

    console.log('AI article saved with ID:', aiArticle.id);

    return NextResponse.json({
      success: true,
      article: {
        id: aiArticle.id,
        title: aiArticle.title,
        status: aiArticle.status
      }
    });

  } catch (error) {
    console.error('Error saving AI article:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save AI article',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const aiArticles = await prisma.aiArticle.findMany({
      orderBy: { created_at: 'desc' },
      take: 50
    });

    return NextResponse.json(aiArticles);
  } catch (error) {
    console.error('Error fetching AI articles:', error);
    return NextResponse.json([], { status: 500 });
  }
}