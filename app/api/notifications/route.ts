import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
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
    const limit = parseInt(searchParams.get("limit") || "20");
    const unreadOnly = searchParams.get("unread_only") === "true";
    const skip = (page - 1) * limit;

    const where: any = { user_id: user.id };
    if (unreadOnly) {
      where.is_read = false;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: {
          article: {
            select: {
              id: true,
              title: true,
              slug: true,
              content_type: true,
            }
          }
        }
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({ 
        where: { user_id: user.id, is_read: false } 
      })
    ]);

    return NextResponse.json({
      notifications,
      unread_count: unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { notification_ids, mark_all_read } = await request.json();

    if (mark_all_read) {
      // Mark all notifications as read
      await prisma.notification.updateMany({
        where: { 
          user_id: user.id,
          is_read: false 
        },
        data: { 
          is_read: true,
          read_at: new Date()
        }
      });

      return NextResponse.json({ message: "All notifications marked as read" });
    } else if (notification_ids && Array.isArray(notification_ids)) {
      // Mark specific notifications as read
      await prisma.notification.updateMany({
        where: { 
          id: { in: notification_ids },
          user_id: user.id 
        },
        data: { 
          is_read: true,
          read_at: new Date()
        }
      });

      return NextResponse.json({ message: "Notifications marked as read" });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}

// Helper function to create notifications
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  articleId?: string,
  data?: any
) {
  try {
    await prisma.notification.create({
      data: {
        user_id: userId,
        type: type as any,
        title,
        message,
        article_id: articleId,
        data: data || {},
      }
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}