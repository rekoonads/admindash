import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const banners = await prisma.article.findMany({
      where: {
        is_featured: true,
        status: 'PUBLISHED',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featured_image: true,
        video_url: true,
        created_at: true,
        category: true,
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 5,
    });

    return NextResponse.json(banners);
  } catch (error) {
    console.error('Banners error:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}