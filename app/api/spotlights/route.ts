import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const spotlights = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        type: "SPOTLIGHT"
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(spotlights)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch spotlights" }, { status: 500 })
  }
}