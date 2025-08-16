import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const animeContent = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        type: "ANIME"
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(animeContent)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch anime content" }, { status: 500 })
  }
}