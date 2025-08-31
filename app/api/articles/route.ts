import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function getBaseUrl(): string {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  return 'https://koodos.in';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const status = searchParams.get('status') || 'PUBLISHED';
    const limit = parseInt(searchParams.get('limit') || '20');
    const featured = searchParams.get('featured') === 'true';

    const where: any = { status };
    
    if (categorySlug) {
      where.OR = [
        { category_id: categorySlug },
        { category: { slug: categorySlug } }
      ];
    }
    
    if (featured) {
      where.is_featured = true;
    }

    let articles = []
    try {
      articles = await prisma.article.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: limit,
      });
    } catch (error) {
      console.error('Database query failed:', error)
      return NextResponse.json([])
    }

    const baseUrl = getBaseUrl();
    const transformedArticles = articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      featuredImage: article.featured_image,
      videoUrl: article.video_url,
      author: article.author_name || 'Unknown Author',
      publishedAt: article.published_at,
      createdAt: article.created_at,
      updatedAt: article.updated_at,
      status: article.status,
      type: article.type || 'NEWS',
      isFeatured: article.is_featured || false,
      viewsCount: article.views_count || 0,
      category: null,
      categoryId: article.category_id || 'general',
      url: `${baseUrl}/article/${article.category?.slug || 'news'}/${article.slug}`,
      reviewScore: article.review_score,
      platforms: article.platforms,
      genres: article.genres,
      pros: article.pros,
      cons: article.cons,
      verdict: article.verdict,
      purchaseLink: article.purchase_link,
      price: article.price,
      metaTitle: article.meta_title,
      metaDescription: article.meta_description,
      metaKeywords: article.meta_keywords
    }));

    return NextResponse.json(transformedArticles);

  } catch (error) {
    console.error('Error in articles API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch articles',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Get any existing user as author
    let systemUser = await prisma.user.findFirst();
    
    if (!systemUser) {
      // Create system user if no users exist
      systemUser = await prisma.user.create({
        data: {
          clerk_id: 'system-' + Date.now(),
          email: 'system@koodos.in',
          role: 'ADMIN'
        }
      });
    }

    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50) + '-' + Date.now();

    const article = await prisma.article.create({
      data: {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt || body.content.substring(0, 200) + '...',
        slug,
        author_id: systemUser.id,
        author_name: body.author_name || 'Admin',
        category_id: null,
        status: body.status || 'DRAFT',
        type: body.type || 'NEWS',
        content_type: body.content_type || 'manual',
        
        // Optional fields
        meta_title: body.meta_title || null,
        meta_description: body.meta_description || null,
        meta_keywords: body.meta_keywords || null,
        featured_image: body.featured_image || null,
        video_url: body.video_url || null,
        audio_url: body.audio_url || null,
        gallery_images: body.gallery_images || [],
        game_title: body.game_title || null,
        developer: body.developer || null,
        publisher: body.publisher || null,
        release_date: body.release_date ? new Date(body.release_date) : null,
        review_score: body.review_score || null,
        pros: body.pros || [],
        cons: body.cons || [],
        verdict: body.verdict || null,
        purchase_link: body.purchase_link || null,
        price: body.price || null,
        platforms: body.platforms || [],
        genres: body.genres || [],
        is_breaking: body.is_breaking || false,
        is_featured: body.is_featured || false,
        show_on_homepage: body.show_on_homepage || false,
        is_sponsored: body.is_sponsored || false,
        is_premium: body.is_premium || false,
        tags: body.tags || [],
        published_at: body.status === 'PUBLISHED' ? new Date() : null,
        scheduled_at: body.scheduled_at ? new Date(body.scheduled_at) : null
      }
    });

    console.log('Manual article created successfully:', article.id);

    return NextResponse.json({
      success: true,
      article: {
        id: article.id,
        title: article.title,
        slug: article.slug,
        status: article.status
      }
    });

  } catch (error) {
    console.error('Error creating manual article:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create article',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}