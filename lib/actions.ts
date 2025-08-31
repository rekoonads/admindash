"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";

import { generateArticleUrl } from '@/lib/url-utils';

export async function createArticle(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Authentication required");
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = (formData.get("excerpt") as string) || "";
    const categoryId = formData.get("categoryId") as string;
    
    console.log('📝 Creating article with categoryId:', categoryId);
    console.log('🔍 Raw form data received:', {
      title,
      categoryId,
      type: formData.get('type'),
      status: formData.get('status')
    });
    console.log('🔍 All form data keys:', Array.from(formData.keys()));
    console.log('🔍 All form data values:', Array.from(formData.entries()));
    
    // Validate required fields
    if (!title?.trim() || !content?.trim()) {
      throw new Error("Title and content are required");
    }
    
    console.log('📋 Backend received:', {
      categoryId,
      title,
      nodeEnv: process.env.NODE_ENV,
      baseUrl: process.env.NEXT_PUBLIC_SITE_URL
    });
    
    if (!categoryId?.trim()) {
      console.error('❌ No categoryId provided, received:', categoryId);
      throw new Error("Category is required. Please select a valid category.");
    }

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

    console.log('Looking for category with ID/slug:', categoryId);
    
    // List all available categories first
    const allCategories = await prisma.category.findMany({ select: { id: true, slug: true, name: true } });
    console.log('All available categories:', allCategories);
    
    // Find category by ID or slug
    let categoryExists = await prisma.category.findFirst({
      where: {
        OR: [
          { id: categoryId },
          { slug: categoryId }
        ]
      },
      select: { id: true, slug: true, name: true }
    });
    
    console.log('Found category:', categoryExists);
    
    if (!categoryExists) {
      console.error('❌ Category lookup failed:', {
        searchedFor: categoryId,
        availableCategories: await prisma.category.findMany({ select: { slug: true, name: true } })
      });
      throw new Error(`Category not found: ${categoryId}. Please select a valid category.`);
    }
    


    // Generate unique article slug
    const { generateSlug, ensureUniqueArticleSlug } = await import('@/lib/slug-utils')
    const baseSlug = generateSlug(title).substring(0, 50)
    const slug = await ensureUniqueArticleSlug(baseSlug)

    // Get or create user
    let user;
    const clerkUser = await currentUser();
    
    try {
      user = await prisma.user.findUnique({
        where: { clerk_id: userId }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            clerk_id: userId,
            email: clerkUser?.emailAddresses[0]?.emailAddress || "user@example.com",
            first_name: clerkUser?.firstName || "User",
            last_name: clerkUser?.lastName || "",
            username: clerkUser?.username || null,
            role: "ADMIN",
            last_login: new Date()
          }
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
      clerkUser.emailAddresses?.[0]?.emailAddress?.split('@')[0] ||
      'User' : 
      `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 
      user?.username || 
      'User';
    
    console.log('👤 Author info:', {
      clerkUser: clerkUser ? {
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        username: clerkUser.username,
        fullName: clerkUser.fullName,
        email: clerkUser.emailAddresses?.[0]?.emailAddress
      } : null,
      finalAuthorName: authorName
    });
    


    console.log('💾 Saving article with category:', {
      categoryId: categoryExists.id,
      categorySlug: categoryExists.slug,
      categoryName: categoryExists.name
    });
    
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
        category_id: categoryExists.id,
        author_id: user?.id || userId,
        author_name: authorName,
        platforms: platform ? [platform as any] : [],
        genres: genre ? [genre as any] : [],
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
        category_tags: selectedCategories
      }
    });

    // Generate dynamic URL based on category and environment
    const articleUrl = generateArticleUrl(categoryExists.slug, slug);
    
    console.log('✅ Article created:', {
      id: article.id,
      title: article.title,
      slug: article.slug,
      category: categoryExists.slug,
      url: articleUrl
    });

    revalidatePath("/admin/content");
    revalidatePath("/");
    
    // Return article with generated URL
    return {
      ...article,
      url: articleUrl,
      category: categoryExists
    };
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
    if (filters?.category) {
      // Find category by slug to get the ID
      const categoryExists = await prisma.category.findFirst({
        where: { slug: filters.category },
        select: { id: true }
      });
      if (categoryExists) {
        where.category_id = categoryExists.id;
      }
    }
    if (filters?.type) where.type = filters.type;
    
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
        { author_name: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        category: true
      },
      orderBy: { created_at: "desc" },
      take: filters?.limit || undefined,
    });

    if (!Array.isArray(articles)) {
      console.error('Articles is not an array:', articles);
      return [];
    }

    // Transform articles to match Post type expectations
    const transformedArticles = articles.map(article => ({
      ...article,
      author: article.author_name || 'Unknown Author',
      views: article.views_count
    }));

    return transformedArticles;
  } catch (error) {
    console.error("Error in getArticles:", error);
    return [];
  }
}

export async function getPublishedArticles(categorySlug?: string, type?: string, featured?: boolean, limit?: number) {
  try {
    const where: any = { status: "PUBLISHED" };
    
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    if (type) where.type = type;
    if (featured) where.is_featured = true;

    const articles = await prisma.article.findMany({
      where,
      include: { 
        category: true
      },
      orderBy: { published_at: "desc" },
      take: limit || 20,
    });

    if (!Array.isArray(articles)) {
      console.error('Articles is not an array:', articles);
      return [];
    }

    // Transform articles to match Post type expectations
    const transformedArticles = articles.map(article => ({
      ...article,
      author: article.author_name || 'Unknown Author',
      views: article.views_count
    }));

    return transformedArticles;
  } catch (error) {
    console.error("Error in getPublishedArticles:", error);
    return [];
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    console.log('🔍 Looking for article with slug:', slug)
    const article = await prisma.article.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });
    
    console.log('📄 Article result:', article ? {
      id: article.id,
      title: article.title,
      slug: article.slug,
      status: article.status,
      categoryId: article.category_id
    } : 'NOT FOUND')

    if (article && article.status === "PUBLISHED") {
      await prisma.article.update({
        where: { id: article.id },
        data: { 
          views_count: { increment: 1 }
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
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const updateData: any = { status: status as any };
    
    if (status === "PUBLISHED") {
      updateData.published_at = new Date();
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/content");
    revalidatePath("/");
    return article;
  } catch (error) {
    console.error("Error in updateArticleStatus:", error);
    throw new Error(`Failed to update article status: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      // Validate category exists
      const categoryExists = await prisma.category.findFirst({
        where: {
          OR: [
            { id: categoryId },
            { slug: categoryId }
          ]
        },
        select: { id: true, slug: true, name: true }
      });
      
      if (!categoryExists) {
        throw new Error(`Category not found: ${categoryId}`);
      }
      
      updateData.category_id = categoryExists.id;
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        category: true
      }
    });

    // Generate dynamic URL
    const articleUrl = generateArticleUrl(article.category?.slug || 'latest-updates', slug);

    revalidatePath("/admin/content");
    revalidatePath("/");
    
    return {
      ...article,
      url: articleUrl
    };
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
    
    // Add dynamic URLs to banners
    const bannersWithUrls = banners.map(banner => ({
      ...banner,
      url: generateArticleUrl(banner.category?.slug || 'latest-updates', banner.slug)
    }));
    
    return bannersWithUrls;
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
    await prisma.article.update({
      where: { id },
      data: { views_count: { increment: 1 } },
    });
  } catch (error) {
    console.error('Error in incrementPostViews:', error);
  }
}

export async function getPublishedPosts(categorySlug?: string) {
  return getPublishedArticles(categorySlug);
}