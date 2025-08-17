import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const nintendoContent = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        platforms: { has: "NINTENDO_SWITCH" }
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(nintendoContent)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Nintendo content" }, { status: 500 })
  }
}