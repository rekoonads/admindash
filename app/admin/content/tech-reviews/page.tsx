"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Monitor } from "lucide-react"

export default function TechReviewsPage() {
  return (
    <ContentManagementPage
      title="Tech Reviews"
      description="Manage technology product reviews and ratings"
      contentType="Tech Review"
      category="tech-reviews"
      icon={Monitor}
    />
  )
}