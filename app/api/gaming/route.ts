import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const gamingContent = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        OR: [
          { platforms: { hasSome: ["PC", "PS5", "PS4", "XBOX_SERIES", "XBOX_ONE", "NINTENDO_SWITCH"] } },
          { type: "GAME_REVIEW" },
          { genres: { hasSome: ["ACTION", "ADVENTURE", "RPG", "STRATEGY", "SIMULATION", "SPORTS", "RACING", "FIGHTING", "PUZZLE", "HORROR", "SHOOTER", "PLATFORMER", "MMO", "INDIE", "CASUAL"] } }
        ]
      },
      orderBy: { published_at: "desc" },
      take: 20,
      include: {
        category: true
      }
    })

    return NextResponse.json(gamingContent)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gaming content" }, { status: 500 })
  }
}