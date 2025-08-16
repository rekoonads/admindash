import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const cosplayContent = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        type: "COSPLAY"
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(cosplayContent)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cosplay content" }, { status: 500 })
  }
}