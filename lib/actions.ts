"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

export async function createArticle(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = (formData.get("excerpt") as string) || "";
    const categoryId = formData.get("categoryId") as string;
    const type = (formData.get("type") as string) || "ARTICLE";
    const status = (formData.get("status") as string) || "DRAFT";
    const image = (formData.get("image") as string) || "";
    const platform = (formData.get("platform") as string) || "";
    const genre = (formData.get("genre") as string) || "";
    const rating = (formData.get("rating") as string) || "";
    const pros = (formData.get("pros") as string) || "";
    const cons = (formData.get("cons") as string) || "";
    const verdict = (formData.get("verdict") as string) || "";

    if (!title || !content) {
      throw new Error("Title and content are required");
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 50);

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: "admin@koodos.com",
          name: "Admin User",
          role: "ADMIN"
        }
      });
    }

    // Get or create category
    let category = await prisma.category.findUnique({
      where: { slug: categoryId || "gaming" }
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: "Gaming",
          slug: "gaming",
          description: "Gaming content"
        }
      });
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        image: image || null,
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

    // Create media entries if provided
    if (videoUrl) {
      await prisma.media.create({
        data: {
          url: videoUrl,
          type: "VIDEO",
          alt: title,
          articleId: article.id
        }
      });
    }
    
    if (thumbnail) {
      await prisma.media.create({
        data: {
          url: thumbnail,
          type: "IMAGE",
          alt: `${title} thumbnail`,
          articleId: article.id
        }
      });
    }

    revalidatePath("/admin/content");
    revalidatePath("/");
    return article;
  } catch (error) {
    console.error("Error in createArticle:", error);
    throw error;
  }
}

export async function getArticles(filters?: {
  status?: string;
  category?: string;
  type?: string;
  search?: string;
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
    });

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

export async function createVideoContent(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const category = (formData.get("category") as string) || "gaming";
    const platform = (formData.get("platform") as string) || "";
    const status = (formData.get("status") as string) || "DRAFT";

    if (!title || !videoUrl) {
      throw new Error("Title and video URL are required");
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Get or create user
    let user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: "admin@koodos.com",
          name: "Admin User",
          role: "ADMIN"
        }
      });
    }

    // Get or create category
    let categoryRecord = await prisma.category.findUnique({
      where: { slug: category }
    });

    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: {
          name: category.charAt(0).toUpperCase() + category.slice(1),
          slug: category,
          description: `${category} content`
        }
      });
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content: description,
        excerpt: description.substring(0, 200),
        type: "VIDEO",
        status: status as any,
        platform: platform || null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        authorId: user.id,
        categoryId: categoryRecord.id
      },
      include: {
        author: { select: { name: true, email: true } },
        category: { select: { name: true, slug: true } }
      }
    });

    // Create media entry for video
    await prisma.media.create({
      data: {
        url: videoUrl,
        type: "VIDEO",
        alt: title,
        articleId: article.id
      }
    });

    revalidatePath("/admin/content/videos");
    revalidatePath("/");
    return article;
  } catch (error) {
    console.error("Error in createVideoContent:", error);
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