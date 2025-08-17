import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerk_id: userId },
      include: {
        _count: {
          select: {
            articles: true,
            comments: true,
            reactions: true,
            bookmarks: true,
            followers: true,
            follows: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove sensitive data
    const { clerk_id, ...userProfile } = user;

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

    const updateData = await request.json();
    
    // Only allow certain fields to be updated
    const allowedFields = [
      'display_name', 'bio', 'website', 'location', 
      'social_links', 'privacy_settings', 'notification_prefs'
    ];
    
    const filteredData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key];
        return obj;
      }, {} as any);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...filteredData,
        updated_at: new Date()
      },
      include: {
        _count: {
          select: {
            articles: true,
            comments: true,
            reactions: true,
            bookmarks: true,
            followers: true,
            follows: true,
          }
        }
      }
    });

    // Create activity log
    await prisma.activityLog.create({
      data: {
        user_id: user.id,
        action: "UPDATE",
        entity_type: "user",
        entity_id: user.id,
        metadata: {
          updated_fields: Object.keys(filteredData)
        }
      }
    });

    // Remove sensitive data
    const { clerk_id, ...userProfile } = updatedUser;

    return NextResponse.json(userProfile);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}