import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const scienceComicsContent = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { type: "SCIENCE" },
          { type: "COMICS" }
        ]
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(scienceComicsContent)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch science & comics content" }, { status: 500 })
  }
}