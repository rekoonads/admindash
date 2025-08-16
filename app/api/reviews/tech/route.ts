import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const techReviews = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        type: "TECH_REVIEW"
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(techReviews)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tech reviews" }, { status: 500 })
  }
}