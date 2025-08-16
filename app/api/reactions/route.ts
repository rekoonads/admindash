import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
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

    const { article_id, type } = await request.json();

    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        user_id_article_id: {
          user_id: user.id,
          article_id: article_id
        }
      }
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        // Remove reaction if same type
        await prisma.reaction.delete({
          where: { id: existingReaction.id }
        });
        
        // Update article likes count
        await prisma.article.update({
          where: { id: article_id },
          data: { likes_count: { decrement: 1 } }
        });

        return NextResponse.json({ action: "removed" });
      } else {
        // Update reaction type
        await prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type }
        });

        return NextResponse.json({ action: "updated" });
      }
    } else {
      // Create new reaction
      await prisma.reaction.create({
        data: {
          user_id: user.id,
          article_id,
          type
        }
      });

      // Update article likes count
      await prisma.article.update({
        where: { id: article_id },
        data: { likes_count: { increment: 1 } }
      });

      return NextResponse.json({ action: "created" });
    }
  } catch (error) {
    console.error("Error handling reaction:", error);
    return NextResponse.json(
      { error: "Failed to handle reaction" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const articleId = searchParams.get("article_id");

    if (!articleId) {
      return NextResponse.json({ error: "Article ID required" }, { status: 400 });
    }

    const reactions = await prisma.reaction.groupBy({
      by: ['type'],
      where: { article_id: articleId },
      _count: { type: true }
    });

    const reactionCounts = reactions.reduce((acc, reaction) => {
      acc[reaction.type] = reaction._count.type;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json(reactionCounts);
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch reactions" },
      { status: 500 }
    );
  }
}