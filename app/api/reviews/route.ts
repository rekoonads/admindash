import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const reviews = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        type: "REVIEW"
      },
      orderBy: { published_at: "desc" },
      take: 20,
      include: {
        category: true
      }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}