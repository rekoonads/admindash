import { NextResponse } from "next/server";
import { getPostBySlug, incrementPostViews } from "@/lib/actions";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

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

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const post = await getPostBySlug(slug);

    if (!post || post.status !== "PUBLISHED") {
      const response = NextResponse.json(
        {
          success: false,
          error: "Article not found",
        },
        { status: 404 }
      );
      return addCorsHeaders(response);
    }

    // Increment views (fire and forget)
    incrementPostViews(post.id);

    // Transform data for public consumption
    const publicPost = {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      category: post.category,
      author: post.author,
      views: post.views + 1, // Include the incremented view
      slug: post.slug,
      tags: post.tags,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    const response = NextResponse.json({
      success: true,
      data: publicPost,
    });
    return addCorsHeaders(response);
  } catch (error) {
    console.error("API Error:", error);
    const response = NextResponse.json(
      {
        success: false,
        error: "Failed to fetch article",
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
