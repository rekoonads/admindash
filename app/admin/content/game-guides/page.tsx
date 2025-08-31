"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { BookOpen } from "lucide-react"

export default function GameGuidesPage() {
  return (
    <ContentManagementPage
      title="Game Guides"
      description="Create comprehensive gaming guides and tutorials"
      contentType="Game Guide"
      category="guides"
      icon={BookOpen}
    />
  )
}