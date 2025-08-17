import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { generateSlug, ensureUniqueArticleSlug } from "@/lib/slug-utils"
import { revalidatePath, revalidateTag } from "next/cache"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
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

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    // Check if article exists
    const existingArticle = await prisma.article.findUnique({
      where: { id: params.id },
      include: { author: true, category: true }
    })

    if (!existingArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Update slug if title changed
    let slug = existingArticle.slug
    if (body.title && body.title !== existingArticle.title) {
      const baseSlug = generateSlug(body.title)
      slug = await ensureUniqueArticleSlug(baseSlug, params.id)
    }

    // Get category if changed
    let categoryId = existingArticle.category_id
    if (body.category_slug && body.category_slug !== existingArticle.category?.slug) {
      const category = await prisma.category.findUnique({
        where: { slug: body.category_slug }
      })
      categoryId = category?.id || null
    }

    // Update article
    const article = await prisma.article.update({
      where: { id: params.id },
      data: {
        title: body.title || existingArticle.title,
        content: body.content || existingArticle.content,
        excerpt: body.excerpt !== undefined ? body.excerpt : existingArticle.excerpt,
        slug,
        category_id: categoryId,
        status: body.status || existingArticle.status,
        type: body.type || existingArticle.type,
        
        // SEO
        meta_title: body.meta_title !== undefined ? body.meta_title : existingArticle.meta_title,
        meta_description: body.meta_description !== undefined ? body.meta_description : existingArticle.meta_description,
        meta_keywords: body.meta_keywords !== undefined ? body.meta_keywords : existingArticle.meta_keywords,
        
        // Media
        featured_image: body.featured_image !== undefined ? body.featured_image : existingArticle.featured_image,
        video_url: body.video_url !== undefined ? body.video_url : existingArticle.video_url,
        
        // Content flags
        is_featured: body.is_featured !== undefined ? body.is_featured : existingArticle.is_featured,
        show_on_homepage: body.show_on_homepage !== undefined ? body.show_on_homepage : existingArticle.show_on_homepage,
        
        // Publishing
        published_at: body.status === "PUBLISHED" && existingArticle.status !== "PUBLISHED" 
          ? new Date() 
          : existingArticle.published_at,
        
        updated_at: new Date(),
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

    // Revalidate paths
    revalidatePath("/")
    revalidatePath(`/${article.category?.slug || 'news'}`)
    revalidatePath(`/${article.category?.slug || 'news'}/${article.slug}`)
    revalidateTag("articles")

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: { category: true }
    })

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    await prisma.article.delete({
      where: { id: params.id }
    })

    // Revalidate paths
    revalidatePath("/")
    revalidatePath(`/${article.category?.slug || 'news'}`)
    revalidateTag("articles")

    return NextResponse.json({ message: "Article deleted successfully" })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    )
  }
}