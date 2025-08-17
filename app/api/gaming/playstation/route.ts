import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const playstationContent = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { platforms: { has: "PS5" } },
          { platforms: { has: "PS4" } }
        ]
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(playstationContent)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch PlayStation content" }, { status: 500 })
  }
}