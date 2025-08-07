"use server";

import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";

// Simplified version for testing
export async function createPostSimple(data: {
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  category?: string;
  status?: "draft" | "published" | "hidden";
}) {
  try {
    console.log("Creating post with simple data:", data);

    const postData = {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || null,
      author: data.author || "Admin User",
      category: data.category || "news",
      status: data.status || "draft",
      slug: data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      views: 0,
      tags: [],
    };

    const { data: result, error } = await supabase
      .from("posts")
      .insert(postData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log("Post created successfully:", result);
    revalidatePath("/admin/news");
    revalidatePath("/news");
    return result;
  } catch (error) {
    console.error("Error in createPostSimple:", error);
    throw error;
  }
}

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const author = formData.get("author") as string;
  const category = formData.get("category") as string;
  const status = formData.get("status") as "draft" | "published" | "hidden";

  return createPostSimple({
    title,
    content,
    excerpt,
    author,
    category,
    status,
  });
}

export async function updatePost(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const category = formData.get("category") as string;
    const status = formData.get("status") as "draft" | "published" | "hidden";

    const updateData = {
      title,
      content,
      excerpt: excerpt || null,
      category: category || "news",
      status: status || "draft",
      slug: title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    };

    const { data, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    revalidatePath("/admin/news");
    revalidatePath("/news");
    return data;
  } catch (error) {
    console.error("Error in updatePost:", error);
    throw error;
  }
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/news");
  revalidatePath("/news");
}

export async function updatePostStatus(
  id: string,
  status: "draft" | "published" | "hidden"
) {
  const { error } = await supabase
    .from("posts")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/news");
  revalidatePath("/news");
}

export async function incrementPostViews(id: string) {
  const { error } = await supabase.rpc("increment_post_views", { post_id: id });

  if (error) {
    console.error("Error incrementing views:", error);
  }
}
