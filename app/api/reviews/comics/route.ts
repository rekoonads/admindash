import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const comicReviews = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        type: "COMIC_REVIEW"
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(comicReviews)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch comic reviews" }, { status: 500 })
  }
}