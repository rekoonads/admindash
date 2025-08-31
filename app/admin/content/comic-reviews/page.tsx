"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { BookOpen } from "lucide-react"

export default function ComicReviewsPage() {
  return (
    <ContentManagementPage
      title="Comic Reviews"
      description="Manage comic book reviews and ratings"
      contentType="Comic Review"
      category="comic-reviews"
      icon={BookOpen}
    />
  )
}