"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function createArticle(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error("Unauthorized: No user ID");
      // In production, create with default user if auth fails
      const defaultUserId = "default-admin";
      console.log("Using default user ID:", defaultUserId);
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = (formData.get("excerpt") as string) || "";
    const categoryId = (formData.get("categoryId") as string) || "latest-news";
    
    console.log("Using categoryId:", categoryId);
    const categoriesJson = formData.get("categories") as string;
    let selectedCategories = categoriesJson ? JSON.parse(categoriesJson) : [categoryId];
    // Ensure primary category is always included
    if (!selectedCategories.includes(categoryId)) {
      selectedCategories.push(categoryId);
    }
    const type = (formData.get("type") as string) || "NEWS";
    const status = (formData.get("status") as string) || "DRAFT";
    const image = (formData.get("image") as string) || "";
    const videoUrl = (formData.get("videoUrl") as string) || "";
    const thumbnail = (formData.get("thumbnail") as string) || "";
    const featuredImage = (formData.get("featuredImage") as string) || "";
    const platform = (formData.get("platform") as string) || "";
    const genre = (formData.get("genre") as string) || "";
    const rating = (formData.get("rating") as string) || "";
    const pros = (formData.get("pros") as string) || "";
    const cons = (formData.get("cons") as string) || "";
    const verdict = (formData.get("verdict") as string) || "";
    const scheduledDate = formData.get("scheduledDate") as string;
    const metaTitle = (formData.get("metaTitle") as string) || "";
    const metaDescription = (formData.get("metaDescription") as string) || "";
    const metaKeywords = (formData.get("metaKeywords") as string) || "";
    const isFeatured = formData.get("isFeatured") === "true";
    const purchaseLink = (formData.get("purchaseLink") as string) || "";
    const price = (formData.get("price") as string) || "";

    console.log("Creating article:", { title, categoryId, type, status, category: categoryId, selectedCategories });

    if (!title?.trim() || !content?.trim()) {
      console.error("Missing required fields:", { title: !!title, content: !!content });
      throw new Error("Title and content are required");
    }

    // Validate category exists and get category data
    const categoryExists = await prisma.category.findUnique({
      where: { slug: categoryId },
      select: { id: true, slug: true, name: true }
    });
    if (!categoryExists) {
      throw new Error(`Category '${categoryId}' does not exist`);
    }

    // Generate unique article slug
    const { generateSlug, ensureUniqueArticleSlug } = await import('@/lib/slug-utils')
    const baseSlug = generateSlug(title).substring(0, 50)
    const slug = await ensureUniqueArticleSlug(baseSlug)

    // Get or create user
    const actualUserId = userId || "default-admin";
    let user;
    const clerkUser = await currentUser();
    
    try {
      user = await prisma.user.findUnique({
        where: { clerk_id: actualUserId }
      });

      if (!user) {
        console.log("Creating new user for:", actualUserId);
        user = await prisma.user.create({
          data: {
            clerk_id: actualUserId,
            email: clerkUser?.emailAddresses[0]?.emailAddress || "user@example.com",
            first_name: clerkUser?.firstName || "User",
            last_name: clerkUser?.lastName || "",
            username: clerkUser?.username || null,
            role: "ADMIN",
            last_login: new Date()
          }
        });
      } else {
        // Update last login for existing user
        await prisma.user.update({
          where: { id: user.id },
          data: { last_login: new Date() }
        });
      }
    } catch (userError) {
      console.error("User creation/update error:", userError);
      // Use default user data if user operations fail
      user = { first_name: "Admin", last_name: "User", username: null };
    }
    
    // Use actual user name from Clerk or database
    const authorName = clerkUser ? 
      `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 
      clerkUser.username || 
      clerkUser.fullName || 
      'User' : 
      `${user.first_name || ''} ${user.last_name || ''}`.trim() || 
      user.username || 
      'User';
    
    console.log('Author name being saved:', authorName, 'Clerk user:', clerkUser?.firstName, clerkUser?.lastName);

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        featured_image: image || videoUrl || featuredImage || null,
        video_url: videoUrl || null,
        type: type as any,
        status: status as any,
        category_id: categoryId,
        author: authorName,
        platform: platform ? [platform as any] : [],
        genre: genre ? [genre as any] : [],
        review_score: rating ? parseFloat(rating) : null,
        pros: pros ? [pros] : [],
        cons: cons ? [cons] : [],
        verdict: verdict || null,
        published_at: status === "PUBLISHED" ? new Date() : status === "SCHEDULED" && scheduledDate ? new Date(scheduledDate) : null,
        meta_title: metaTitle || title,
        meta_description: metaDescription || excerpt || title,
        meta_keywords: metaKeywords || null,
        is_featured: isFeatured,
        purchase_link: purchaseLink || null,
        price: price || null,
        categories: {
          create: selectedCategories.map(cat => ({ category: cat }))
        }
      }
    });

    console.log("Article created successfully:", article.id);

    revalidatePath("/admin/content");
    revalidatePath("/");
    return article;
  } catch (error) {
    console.error("Error in createArticle:", error);
    throw new Error(`Failed to create article: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getArticles(filters?: {
  status?: string;
  category?: string;
  type?: string;
  platform?: string;
  search?: string;
  limit?: number;
}) {
  try {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.type) where.type = filters.type;
    
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
        { author: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        category: true,
        categories: true
      },
      orderBy: { created_at: "desc" },
      take: filters?.limit || undefined,
    });

    return articles;
  } catch (error) {
    console.error("Error in getArticles:", error);
    return [];
  }
}

export async function getPublishedArticles(categorySlug?: string, type?: string, featured?: boolean, limit?: number) {
  try {
    const where: any = { status: "PUBLISHED" };
    
    if (categorySlug) {
      where.OR = [
        { category_id: categorySlug },
        { categories: { some: { category: categorySlug } } }
      ];
    }
    if (type) where.type = type;
    if (featured) where.is_featured = true;

    const articles = await prisma.article.findMany({
      where,
      include: { 
        category: true,
        categories: true 
      },
      orderBy: { published_at: "desc" },
      take: limit || 20,
    });

    return articles;
  } catch (error) {
    console.error("Error in getPublishedArticles:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: true,
        categories: true
      }
    });

    if (article && article.status === "PUBLISHED") {
      await prisma.article.update({
        where: { id: article.id },
        data: { 
          views: { increment: 1 },
          updated_at: new Date()
        },
      });
    }

    return article;
  } catch (error) {
    console.error("Error in getArticleBySlug:", error);
    return null;
  }
}

export async function updateArticleStatus(id: string, status: string) {
  try {
    const updateData: any = { status: status as any };
    
    if (status === "PUBLISHED") {
      updateData.publishedAt = new Date();
    }

    await prisma.article.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/content");
    revalidatePath("/");
  } catch (error) {
    console.error("Error in updateArticleStatus:", error);
    throw error;
  }
}

// Legacy functions
export const getPosts = getArticles;
export const createPost = createArticle;
export const updatePostStatus = updateArticleStatus;

export async function updatePost(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = (formData.get("excerpt") as string) || "";
    const categoryId = (formData.get("categoryId") as string);
    const status = (formData.get("status") as string) || "DRAFT";
    const featuredImage = (formData.get("featuredImage") as string) || "";

    if (!title || !content) {
      throw new Error("Title and content are required");
    }

    // Generate unique article slug
    const { generateSlug, ensureUniqueArticleSlug } = await import('@/lib/slug-utils')
    const baseSlug = generateSlug(title).substring(0, 50)
    const slug = await ensureUniqueArticleSlug(baseSlug, id)

    const updateData: any = {
      title,
      content,
      excerpt: excerpt || null,
      status: status as any,
      slug,
      featured_image: featuredImage || null,
      published_at: status === "PUBLISHED" ? new Date() : null,
    };

    if (categoryId) {
      updateData.category_id = categoryId;
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        categories: true
      }
    });

    revalidatePath("/admin/content");
    revalidatePath("/");
    return article;
  } catch (error) {
    console.error("Error in updatePost:", error);
    throw error;
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.article.delete({
      where: { id },
    });

    revalidatePath("/admin/content");
    revalidatePath("/");
  } catch (error) {
    console.error("Error in deletePost:", error);
    throw error;
  }
}

export async function getBanners() {
  try {
    const banners = await prisma.article.findMany({
      where: {
        is_featured: true,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featured_image: true,
        created_at: true,
        category_id: true,
        category: {
          select: {
            slug: true,
            name: true
          }
        }
      },
      orderBy: {
        created_at: 'desc',
      },
      take: 5,
    });
    return banners;
  } catch (error) {
    console.error('Error in getBanners:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  return getArticleBySlug(slug);
}

export async function incrementPostViews(id: string) {
  try {
    await (prisma.article as any).update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  } catch (error) {
    console.error('Error in incrementPostViews:', error);
  }
}

export async function getPublishedPosts(categorySlug?: string) {
  return getPublishedArticles(categorySlug);
}