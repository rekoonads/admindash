import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const xboxContent = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { platform: { has: "XBOX_SERIES" } },
          { platform: { has: "XBOX_ONE" } }
        ]
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(xboxContent)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Xbox content" }, { status: 500 })
  }
}