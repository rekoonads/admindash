import { NextResponse } from "next/server";
import { getPosts } from "@/lib/actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category") || undefined;
    const featured = searchParams.get("featured") === "true";

    // Get published posts only
    const posts = await getPosts({
      status: "PUBLISHED",
      category: category,
    });

    // Transform data for public consumption
    const publicPosts = posts.slice(0, limit).map((post) => ({
      id: post.id,
      title: post.title,
      excerpt:
        post.excerpt ||
        post.content.replace(/<[^>]*>/g, "").substring(0, 150) + "...",
      content: post.content,
      featuredImage: post.featuredImage,
      category: post.category,
      author: post.author,
      views: post.views,
      slug: post.slug,
      tags: post.tags,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    }));

    // If featured is requested, return the most recent post first
    if (featured && publicPosts.length > 0) {
      return NextResponse.json({
        success: true,
        data: {
          featured: publicPosts[0],
          articles: publicPosts.slice(1),
          total: posts.length,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        articles: publicPosts,
        total: posts.length,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch news articles",
      },
      { status: 500 }
    );
  }
}

// Enable CORS for cross-origin requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
