import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const mobileContent = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { platforms: { has: "MOBILE_IOS" } },
          { platforms: { has: "MOBILE_ANDROID" } }
        ]
      },
      orderBy: { published_at: "desc" },
      include: {
        category: true
      }
    })

    return NextResponse.json(mobileContent)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch mobile content" }, { status: 500 })
  }
}