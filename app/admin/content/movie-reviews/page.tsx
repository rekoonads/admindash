"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Film } from "lucide-react"

export default function MovieReviewsPage() {
  return (
    <ContentManagementPage
      title="Movie Reviews"
      description="Manage movie reviews and ratings"
      contentType="Movie Review"
      category="movie-reviews"
      icon={Film}
    />
  )
}