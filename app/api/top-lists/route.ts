import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const topLists = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        type: "LIST"
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(topLists)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch top lists" }, { status: 500 })
  }
}