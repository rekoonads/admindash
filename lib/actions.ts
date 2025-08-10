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

    console.log("Creating article:", { title, categoryId, type, status });

    if (!title?.trim() || !content?.trim()) {
      console.error("Missing required fields:", { title: !!title, content: !!content });
      throw new Error("Title and content are required");
    }

    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 50);
    
    // Ensure unique slug
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.article.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Get or create user
    const actualUserId = userId || "default-admin";
    let user = await prisma.user.findUnique({
      where: { clerkId: actualUserId }
    });

    if (!user) {
      console.log("Creating new user for:", actualUserId);
      user = await prisma.user.create({
        data: {
          clerkId: actualUserId,
          email: "admin@koodos.com",
          name: "Koodos Team",
          role: "ADMIN"
        }
      });
    }

    // Get or create category
    let category = await prisma.category.findUnique({
      where: { slug: categoryId }
    });

    if (!category) {
      console.log("Creating new category:", categoryId);
      category = await prisma.category.create({
        data: {
          name: categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
          slug: categoryId,
          description: `${categoryId} content`
        }
      });
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        image: image || videoUrl || featuredImage || null,
        type: type as any,
        status: status as any,
        platform: platform || null,
        genre: genre || null,
        rating: rating ? parseInt(rating) : null,
        pros: pros || null,
        cons: cons || null,
        verdict: verdict || null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        authorId: user.id,
        categoryId: category.id
      },
      include: {
        author: { select: { name: true, email: true } },
        category: { select: { name: true, slug: true } }
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
        { title: { contains: filters.search } },
        { content: { contains: filters.search } }
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        author: { select: { name: true, email: true } },
        category: { select: { name: true, slug: true } }
      },
      orderBy: { createdAt: "desc" },
      take: filters?.limit || undefined,
    }) as any[];

    return articles;
  } catch (error) {
    console.error("Error in getArticles:", error);
    return [];
  }
}

export async function getPublishedArticles(categorySlug?: string, type?: string) {
  try {
    const where: any = { status: "PUBLISHED" };
    
    if (categorySlug) {
      where.category = { slug: categorySlug };
    }
    if (type) where.type = type;

    const articles = await prisma.article.findMany({
      where,
      include: {
        author: { select: { name: true, email: true } },
        category: { select: { name: true, slug: true } }
      },
      orderBy: { publishedAt: "desc" },
      take: 20,
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
        author: { select: { name: true, email: true } },
        category: { select: { name: true, slug: true } }
      }
    });

    if (article) {
      await prisma.article.update({
        where: { id: article.id },
        data: { views: { increment: 1 } },
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
    const status = (formData.get("status") as string) || "DRAFT";
    const image = (formData.get("image") as string) || "";

    if (!title || !content) {
      throw new Error("Title and content are required");
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 50);

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        excerpt: excerpt || null,
        status: status as any,
        slug,
        image: image || null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
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
        featured: true,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        image: true,
        createdAt: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
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