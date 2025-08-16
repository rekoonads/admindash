import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const wikiArticles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        type: "WIKI"
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(wikiArticles)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wiki articles" }, { status: 500 })
  }
}