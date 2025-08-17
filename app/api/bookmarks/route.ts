import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { article_id } = await request.json();

    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        user_id_article_id: {
          user_id: user.id,
          article_id: article_id
        }
      }
    });

    if (existingBookmark) {
      // Remove bookmark
      await prisma.bookmark.delete({
        where: { id: existingBookmark.id }
      });

      // Update article bookmarks count
      await prisma.article.update({
        where: { id: article_id },
        data: { bookmarks_count: { decrement: 1 } }
      });

      return NextResponse.json({ action: "removed" });
    } else {
      // Create bookmark
      await prisma.bookmark.create({
        data: {
          user_id: user.id,
          article_id
        }
      });

      // Update article bookmarks count
      await prisma.article.update({
        where: { id: article_id },
        data: { bookmarks_count: { increment: 1 } }
      });

      return NextResponse.json({ action: "created" });
    }
  } catch (error) {
    console.error("Error handling bookmark:", error);
    return NextResponse.json(
      { error: "Failed to handle bookmark" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { user_id: user.id },
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          article: {
            select: {
              id: true,
              title: true,
              excerpt: true,
              slug: true,
              featured_image: true,
              content_type: true,
              created_at: true,
              author: {
                select: {
                  first_name: true,
                  last_name: true,
                  username: true,
                }
              }
            }
          }
        }
      }),
      prisma.bookmark.count({ where: { user_id: user.id } })
    ]);

    return NextResponse.json({
      bookmarks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}