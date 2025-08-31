import { NextRequest, NextResponse } from 'next/server';
import { generateMultipleTitles } from '@/lib/title-generator';

export async function POST(request: NextRequest) {
  try {
    const { keywords, contentType, count } = await request.json();

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Keywords array is required' },
        { status: 400 }
      );
    }

    const titles = generateMultipleTitles(
      keywords.filter(k => k.trim()), 
      contentType || 'guide', 
      count || 5
    );

    return NextResponse.json({
      success: true,
      titles,
      keywords,
      contentType: contentType || 'guide'
    });
  } catch (error) {
    console.error('Title generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate titles' },
      { status: 500 }
    );
  }
}