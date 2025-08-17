import { NextResponse } from "next/server";
import { getPosts } from "@/lib/actions";

// Add CORS headers to all responses
function addCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

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
      featuredImage: post.featured_image,
      category: post.category,
      author: post.author,
      views: post.views,
      slug: post.slug,
      tags: post.tags,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    }));

    // If featured is requested, return the most recent post first
    if (featured && publicPosts.length > 0) {
      const response = NextResponse.json({
        success: true,
        data: {
          featured: publicPosts[0],
          articles: publicPosts.slice(1),
          total: posts.length,
        },
      });
      return addCorsHeaders(response);
    }

    const response = NextResponse.json({
      success: true,
      data: {
        articles: publicPosts,
        total: posts.length,
      },
    });
    return addCorsHeaders(response);
  } catch (error) {
    console.error("API Error:", error);
    const response = NextResponse.json(
      {
        success: false,
        error: "Failed to fetch news articles",
      },
      { status: 500 }
    );
    return addCorsHeaders(response);
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response);
}
