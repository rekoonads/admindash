"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Palette } from "lucide-react"

export default function AnimePage() {
  return (
    <ContentManagementPage
      title="Anime Content"
      description="Manage anime reviews, news, and coverage"
      contentType="Anime"
      category="anime"
      icon={Palette}
    />
  )
}