import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const tvReviews = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        type: "TV_REVIEW"
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(tvReviews)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch TV reviews" }, { status: 500 })
  }
}