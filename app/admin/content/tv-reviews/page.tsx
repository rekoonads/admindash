"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Tv } from "lucide-react"

export default function TVReviewsPage() {
  return (
    <ContentManagementPage
      title="TV Reviews"
      description="Manage TV show reviews and ratings"
      contentType="TV Review"
      category="tv-reviews"
      icon={Tv}
    />
  )
}