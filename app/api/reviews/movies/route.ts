import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const movieReviews = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        type: "MOVIE_REVIEW"
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(movieReviews)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch movie reviews" }, { status: 500 })
  }
}