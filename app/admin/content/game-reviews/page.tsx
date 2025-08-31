"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Gamepad2 } from "lucide-react"

export default function GameReviewsPage() {
  return (
    <ContentManagementPage
      title="Game Reviews"
      description="Manage video game reviews and ratings"
      contentType="Game Review"
      category="game-reviews"
      icon={Gamepad2}
    />
  )
}