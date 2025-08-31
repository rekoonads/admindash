"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Play } from "lucide-react"

export default function VideosPage() {
  return (
    <ContentManagementPage
      title="Videos"
      description="Manage video content with streaming platform-style layout"
      contentType="Video"
      category="videos"
      icon={Play}

    />
  )
}