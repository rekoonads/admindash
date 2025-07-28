import { NextResponse } from "next/server";
import { getPostBySlug, incrementPostViews } from "@/lib/actions";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;

    const post = await getPostBySlug(slug);

    if (!post || post.status !== "PUBLISHED") {
      return NextResponse.json(
        {
          success: false,
          error: "Article not found",
        },
        { status: 404 }
      );
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

    return NextResponse.json({
      success: true,
      data: publicPost,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch article",
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
