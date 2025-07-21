"use server";

import { prisma } from "./prisma";
import { revalidatePath } from "next/cache";
import type { PostStatus } from "@prisma/client";

export async function createPost(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = (formData.get("excerpt") as string) || "";
    const author = (formData.get("author") as string) || "Admin User";
    const category = (formData.get("category") as string) || "news";
    const status = (formData.get("status") as string) || "DRAFT";
    const tags = (formData.get("tags") as string) || "";

    // Validate required fields
    if (!title || !content) {
      throw new Error("Title and content are required");
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 50);

    // Process tags
    const tagsArray = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    console.log("Creating post with data:", {
      title,
      content: content.substring(0, 100) + "...",
      excerpt,
      author,
      category,
      status,
      slug,
      tags: tagsArray,
    });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt: excerpt || null,
        author,
        category,
        status: status as PostStatus,
        slug,
        tags: tagsArray,
        views: 0,
      },
    });

    console.log("Post created successfully:", post);

    revalidatePath("/admin/news");
    revalidatePath("/news");
    return post;
  } catch (error) {
    console.error("Error in createPost:", error);
    throw error;
  }
}

export async function updatePost(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = (formData.get("excerpt") as string) || "";
    const category = (formData.get("category") as string) || "news";
    const status = (formData.get("status") as string) || "DRAFT";
    const tags = (formData.get("tags") as string) || "";

    if (!title || !content) {
      throw new Error("Title and content are required");
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 50);

    const tagsArray = tags
      ? tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt: excerpt || null,
        category,
        status: status as PostStatus,
        slug,
        tags: tagsArray,
      },
    });

    revalidatePath("/admin/news");
    revalidatePath("/news");
    revalidatePath(`/news/${slug}`);
    return post;
  } catch (error) {
    console.error("Error in updatePost:", error);
    throw error;
  }
}

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    });

    revalidatePath("/admin/news");
    revalidatePath("/news");
  } catch (error) {
    console.error("Error in deletePost:", error);
    throw error;
  }
}

export async function updatePostStatus(
  id: string,
  status: "DRAFT" | "PUBLISHED" | "HIDDEN"
) {
  try {
    await prisma.post.update({
      where: { id },
      data: { status: status as PostStatus },
    });

    revalidatePath("/admin/news");
    revalidatePath("/news");
  } catch (error) {
    console.error("Error in updatePostStatus:", error);
    throw error;
  }
}

export async function incrementPostViews(id: string) {
  try {
    await prisma.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
}

export async function getPosts(filters?: {
  status?: PostStatus;
  category?: string;
  search?: string;
}) {
  try {
    const where: any = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.category) {
      where.category = filters.category;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { content: { contains: filters.search, mode: "insensitive" } },
        { excerpt: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return posts;
  } catch (error) {
    console.error("Error in getPosts:", error);
    throw error;
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
    });

    return post;
  } catch (error) {
    console.error("Error in getPostBySlug:", error);
    throw error;
  }
}

export async function getPublishedPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    });

    return posts;
  } catch (error) {
    console.error("Error in getPublishedPosts:", error);
    throw error;
  }
}

export async function getBanners(
  page: string,
  position: "TOP" | "BOTTOM" | "SIDEBAR"
) {
  try {
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
        OR: [{ page: page }, { page: "all" }],
        position: position,
      },
      orderBy: { createdAt: "desc" },
    });

    return banners;
  } catch (error) {
    console.error("Error in getBanners:", error);
    throw error;
  }
}
