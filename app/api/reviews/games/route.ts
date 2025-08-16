import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const gameReviews = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        type: "GAME_REVIEW"
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(gameReviews)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch game reviews" }, { status: 500 })
  }
}