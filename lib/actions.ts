"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";

export async function createArticle(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = (formData.get("excerpt") as string) || "";
    const author = (formData.get("author") as string) || "Admin User";
    const category = (formData.get("category") as string) || "gaming";
    const type = (formData.get("type") as string) || "NEWS";
    const status = (formData.get("status") as string) || "DRAFT";
    const tags = (formData.get("tags") as string) || "";
    const featuredImage = (formData.get("featuredImage") as string) || "";
    const videoUrl = (formData.get("videoUrl") as string) || "";
    const gameTitle = (formData.get("gameTitle") as string) || "";
    const platform = (formData.get("platform") as string) || "";
    const genre = (formData.get("genre") as string) || "";
    const reviewScore = (formData.get("reviewScore") as string) || "";
    const pros = (formData.get("pros") as string) || "";
    const cons = (formData.get("cons") as string) || "";

    if (!title || !content) {
      throw new Error("Title and content are required");
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 50);

    const tagsArray = tags ? tags.split(",").map(tag => tag.trim()).filter(Boolean) : [];
    const platformArray = platform ? platform.split(",").map(p => p.trim()).filter(Boolean) : [];
    const genreArray = genre ? genre.split(",").map(g => g.trim()).filter(Boolean) : [];
    const prosArray = pros ? pros.split("\n").filter(Boolean) : [];
    const consArray = cons ? cons.split("\n").filter(Boolean) : [];

    const article = await prisma.article.create({
      data: {
        title,
        content,
        excerpt: excerpt || null,
        author,
        category,
        type: type as any,
        status: status as any,
        slug,
        tags: tagsArray,
        featuredImage: featuredImage || null,
        videoUrl: videoUrl || null,
        gameTitle: gameTitle || null,
        platform: platformArray as any,
        genre: genreArray as any,
        reviewScore: reviewScore ? parseFloat(reviewScore) : null,
        pros: prosArray,
        cons: consArray,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });

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
  platform?: string;
  search?: string;
}) {
  try {
    const where: any = {};

    if (filters?.status) where.status = filters.status;
    if (filters?.category) where.category = filters.category;
    if (filters?.type) where.type = filters.type;
    if (filters?.platform) where.platform = { has: filters.platform };
    
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { content: { contains: filters.search, mode: "insensitive" } },
        { gameTitle: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const articles = await prisma.article.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return articles;
  } catch (error) {
    console.error("Error in getArticles:", error);
    throw error;
  }
}

export async function getPublishedArticles(category?: string, type?: string) {
  try {
    const where: any = { status: "PUBLISHED" };
    if (category) where.category = category;
    if (type) where.type = type;

    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: 20,
    });

    return articles;
  } catch (error) {
    console.error("Error in getPublishedArticles:", error);
    throw error;
  }
}

export async function getArticleBySlug(slug: string) {
  try {
    const article = await prisma.article.findUnique({
      where: { slug },
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
    throw error;
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

// Legacy functions for backward compatibility
export const createPost = createArticle;
export const getPosts = getArticles;
export const getPostBySlug = getArticleBySlug;
export const getPublishedPosts = getPublishedArticles;
export const updatePostStatus = updateArticleStatus;
export const incrementPostViews = getArticleBySlug;

export async function updatePost(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = (formData.get("excerpt") as string) || "";
    const category = (formData.get("category") as string) || "gaming";
    const status = (formData.get("status") as string) || "DRAFT";
    const tags = (formData.get("tags") as string) || "";
    const featuredImage = (formData.get("featuredImage") as string) || "";

    if (!title || !content) {
      throw new Error("Title and content are required");
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 50);

    const tagsArray = tags ? tags.split(",").map(tag => tag.trim()).filter(Boolean) : [];

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        excerpt: excerpt || null,
        category,
        status: status as any,
        slug,
        tags: tagsArray,
        featuredImage: featuredImage || null,
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

export async function getBanners(page: string, position: string) {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
        page: page,
        position: position as any,
      },
      orderBy: { createdAt: "desc" },
    });

    return banners;
  } catch (error) {
    console.error("Error in getBanners:", error);
    throw error;
  }
}