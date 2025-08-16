import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const opinions = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        type: "OPINION"
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(opinions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch opinions" }, { status: 500 })
  }
}