import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const guides = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        type: "GUIDE"
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(guides)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch guides" }, { status: 500 })
  }
}