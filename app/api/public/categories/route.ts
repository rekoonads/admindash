import { NextResponse } from "next/server";
import { getPosts } from "@/lib/actions";

export async function GET() {
  try {
    // Get all published posts
    const posts = await getPosts({
      status: "PUBLISHED",
    });

    // Extract unique categories with counts
    const categoryMap = new Map();

    posts.forEach((post) => {
      const category = post.category;
      if (categoryMap.has(category)) {
        categoryMap.set(category, categoryMap.get(category) + 1);
      } else {
        categoryMap.set(category, 1);
      }
    });

    const categories = Array.from(categoryMap.entries()).map(
      ([name, count]) => ({
        name,
        count,
        displayName:
          name.charAt(0).toUpperCase() + name.slice(1).replace("-", " "),
      })
    );

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
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
