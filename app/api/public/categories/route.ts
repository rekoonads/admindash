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

    const response = NextResponse.json({
      success: true,
      data: categories,
    });
    return addCorsHeaders(response);
  } catch (error) {
    console.error("API Error:", error);
    const response = NextResponse.json(
      {
        success: false,
        error: "Failed to fetch categories",
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
