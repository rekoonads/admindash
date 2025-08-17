import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { generateSlug, ensureUniqueArticleSlug } from "@/lib/slug-utils";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { clerk_id: userId }
    });

    if (!user) {
      // Create user if doesn't exist
      const clerkUser = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      }).then(res => res.json());

      user = await prisma.user.create({
        data: {
          clerk_id: userId,
          email: clerkUser.email_addresses[0]?.email_address || "",
          first_name: clerkUser.first_name,
          last_name: clerkUser.last_name,
          username: clerkUser.username,
          avatar: clerkUser.image_url,
          role: "EDITOR", // Default role
        }
      });
    }

    const body = await request.json();
    
    // Generate slug from title
    const baseSlug = generateSlug(body.title);
    const uniqueSlug = await ensureUniqueArticleSlug(baseSlug);

    // Create article
    const article = await prisma.article.create({
      data: {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt,
        slug: uniqueSlug,
        author_id: user.id,
        status: body.status || "DRAFT",
        type: body.type || "NEWS",
        content_type: body.content_type || "latest-updates",
        
        // SEO
        meta_title: body.meta_title,
        meta_description: body.meta_description,
        meta_keywords: body.meta_keywords,
        
        // Media
        featured_image: body.featured_image,
        gallery_images: body.gallery_images || [],
        video_url: body.video_url,
        audio_url: body.audio_url,
        
        // Gaming specific
        game_title: body.game_title,
        developer: body.developer,
        publisher: body.publisher,
        release_date: body.release_date ? new Date(body.release_date) : null,
        review_score: body.review_score,
        pros: body.pros || [],
        cons: body.cons || [],
        verdict: body.verdict,
        purchase_link: body.purchase_link,
        price: body.price,
        platforms: body.platforms || [],
        genres: body.genres || [],
        
        // Content flags
        is_breaking: body.is_breaking || false,
        is_featured: body.is_featured || false,
        show_on_homepage: body.show_on_homepage || false,
        is_sponsored: body.is_sponsored || false,
        is_premium: body.is_premium || false,
        
        // Publishing
        published_at: body.status === "PUBLISHED" ? new Date() : null,
        scheduled_at: body.scheduled_at ? new Date(body.scheduled_at) : null,
        
        // Tags
        tags: body.tags || [],
        category_tags: body.category_tags || [],
        
        // Auto-calculate read time (rough estimate: 200 words per minute)
        read_time: Math.ceil(body.content.split(' ').length / 200),
      },
      include: {
        author: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            username: true,
            avatar: true,
          }
        }
      }
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        user_id: user.id,
        action: "CREATE",
        entity_type: "article",
        entity_id: article.id,
        metadata: {
          title: article.title,
          status: article.status,
          content_type: article.content_type,
        }
      }
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    // Check if article exists and user has permission
    const existingArticle = await prisma.article.findUnique({
      where: { id },
      include: { author: true }
    });

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Check permissions (author or admin/editor)
    if (existingArticle.author_id !== user.id && !["ADMIN", "EDITOR"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update slug if title changed
    let slug = existingArticle.slug;
    if (updateData.title && updateData.title !== existingArticle.title) {
      const baseSlug = generateSlug(updateData.title);
      slug = await ensureUniqueArticleSlug(baseSlug, id);
    }

    // Update article
    const article = await prisma.article.update({
      where: { id },
      data: {
        ...updateData,
        slug,
        updated_at: new Date(),
        published_at: updateData.status === "PUBLISHED" && existingArticle.status !== "PUBLISHED" 
          ? new Date() 
          : existingArticle.published_at,
        scheduled_at: updateData.scheduled_at ? new Date(updateData.scheduled_at) : null,
        read_time: updateData.content ? Math.ceil(updateData.content.split(' ').length / 200) : existingArticle.read_time,
      },
      include: {
        author: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            username: true,
            avatar: true,
          }
        }
      }
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        user_id: user.id,
        action: "UPDATE",
        entity_type: "article",
        entity_id: article.id,
        metadata: {
          title: article.title,
          status: article.status,
          content_type: article.content_type,
          changes: Object.keys(updateData),
        }
      }
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const contentType = searchParams.get("content_type");
    const authorId = searchParams.get("author_id");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status;
    if (contentType) where.content_type = contentType;
    if (authorId) where.author_id = authorId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          author: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              username: true,
              avatar: true,
            }
          },
          _count: {
            select: {
              comments: true,
              reactions: true,
              bookmarks: true,
              shares: true,
            }
          }
        }
      }),
      prisma.article.count({ where })
    ]);

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}