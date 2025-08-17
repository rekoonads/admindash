import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { generateSlug, ensureUniqueArticleSlug } from "@/lib/slug-utils"
import { revalidatePath, revalidateTag } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get or create user in database
    let dbUser = await prisma.user.findUnique({
      where: { clerk_id: userId }
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerk_id: userId,
          email: user.emailAddresses[0]?.emailAddress || "",
          first_name: user.firstName,
          last_name: user.lastName,
          username: user.username,
          avatar: user.imageUrl,
          role: "ADMIN",
        }
      })
    }

    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    // Generate unique slug
    const baseSlug = generateSlug(body.title)
    const uniqueSlug = await ensureUniqueArticleSlug(baseSlug)

    // Get category if provided
    let categoryId = null
    if (body.category_slug) {
      const category = await prisma.category.findUnique({
        where: { slug: body.category_slug }
      })
      categoryId = category?.id || null
    }

    // Create article
    const article = await prisma.article.create({
      data: {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt || null,
        slug: uniqueSlug,
        author_id: dbUser.id,
        author_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'Admin',
        category_id: categoryId,
        status: body.status || "DRAFT",
        type: body.type || "NEWS",
        content_type: body.content_type || "latest-updates",
        
        // SEO
        meta_title: body.meta_title || body.title,
        meta_description: body.meta_description || body.excerpt || body.title,
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
        review_score: body.review_score ? parseFloat(body.review_score) : null,
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
        read_time: Math.ceil((body.content.match(/\w+/g) || []).length / 200),
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
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        }
      }
    })

    // Create activity log
    await prisma.activityLog.create({
      data: {
        user_id: dbUser.id,
        action: "CREATE",
        entity_type: "article",
        entity_id: article.id,
        metadata: {
          title: article.title,
          status: article.status,
          content_type: article.content_type,
        }
      }
    })

    // Revalidate relevant paths for ISR
    if (article.status === "PUBLISHED") {
      revalidatePath("/")
      revalidatePath(`/${article.category?.slug || 'news'}`)
      revalidatePath(`/${article.category?.slug || 'news'}/${article.slug}`)
      revalidateTag("articles")
      revalidateTag(`category-${article.category?.slug}`)
    }

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const category = searchParams.get("category")
    const type = searchParams.get("type")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured") === "true"

    const skip = (page - 1) * limit

    const where: any = {}

    if (status) where.status = status
    if (category) {
      // Support both category ID and slug
      if (category.length === 25) { // CUID length
        where.category_id = category
      } else {
        where.category = { slug: category }
      }
    }
    if (type) where.type = type
    if (featured) where.is_featured = true
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { author_name: { contains: search, mode: "insensitive" } },
      ]
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
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
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
    ])

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    )
  }
}