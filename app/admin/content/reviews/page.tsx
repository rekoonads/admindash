"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Star } from "lucide-react"

export default function ReviewsPage() {
  return (
    <ContentManagementPage
      title="Reviews"
      description="Manage all types of reviews and ratings"
      contentType="All Reviews"
      category="reviews"
      icon={Star}
    />
  )
}