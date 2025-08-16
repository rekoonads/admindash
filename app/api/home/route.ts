import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [featured, latest, reviews, gaming] = await Promise.all([
      prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          show_on_homepage: true
        },
        orderBy: { published_at: "desc" },
        take: 5
      }),
      prisma.article.findMany({
        where: {
          status: "PUBLISHED"
        },
        orderBy: { published_at: "desc" },
        take: 10
      }),
      prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          content_type: { in: ["game-reviews", "movie-reviews", "tv-reviews", "tech-reviews", "comic-reviews"] }
        },
        orderBy: { published_at: "desc" },
        take: 6
      }),
      prisma.article.findMany({
        where: {
          status: "PUBLISHED",
          content_type: { in: ["nintendo", "xbox", "playstation", "pc-gaming", "mobile-gaming"] }
        },
        orderBy: { published_at: "desc" },
        take: 8
      })
    ])

    return NextResponse.json({
      featured,
      latest,
      reviews,
      gaming
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch home content" }, { status: 500 })
  }
}