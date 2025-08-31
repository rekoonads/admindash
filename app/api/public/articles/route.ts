import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const skip = (page - 1) * limit;

    const where: any = {
      status: "PUBLISHED",
      ...(category && { category_id: category }),
      ...(featured === "true" && { is_featured: true }),
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
        orderBy: { published_at: "desc" },
        skip,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    // Transform to match frontend schema
    const transformedArticles = articles.map(article => ({
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
      categoryId: article.category?.id || article.category_id,
      category: article.category ? {
        id: article.category.id,
        name: article.category.name,
        slug: article.category.slug
      } : null,
      authorId: article.author_id,
      author: {
        id: article.author_id,
        name: article.author_name,
      },
    }));

    return NextResponse.json({
      articles: transformedArticles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}