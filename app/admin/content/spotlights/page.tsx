"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Lightbulb } from "lucide-react"

export default function SpotlightsPage() {
  return (
    <ContentManagementPage
      title="Spotlights"
      description="Manage featured content and spotlight articles"
      contentType="Spotlight"
      category="spotlights"
      icon={Lightbulb}
    />
  )
}