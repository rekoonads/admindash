import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: { 
        slug: params.slug,
        status: "PUBLISHED"
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Transform to match frontend schema
    const transformedArticle = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featuredImage: article.featured_image,
      published: article.status === "PUBLISHED",
      featured: article.is_featured,
      views: article.views_count,
      likes: article.likes_count,
      readTime: article.read_time || 5,
      createdAt: article.created_at,
      updatedAt: article.updated_at,
      publishedAt: article.published_at,
      categoryId: article.category_id,
      category: article.category ? {
        id: article.category.id,
        name: article.category.name,
        slug: article.category.slug
      } : null,
      authorId: article.author_id,
      author: {
        id: article.author_id,
        firstName: article.author_name?.split(' ')[0] || 'User',
        lastName: article.author_name?.split(' ').slice(1).join(' ') || '',
        name: article.author_name || 'User'
      },
      tags: [], // Add tags if needed
      metaDescription: article.meta_description,
      metaKeywords: article.meta_keywords,
    };

    return NextResponse.json(transformedArticle);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}