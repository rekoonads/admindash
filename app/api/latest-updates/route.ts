import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        content_type: "latest-updates",
        published_at: { lte: new Date() }
      },
      orderBy: { published_at: "desc" },
      take: 20
    })

    return NextResponse.json(articles)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch latest updates" }, { status: 500 })
  }
}