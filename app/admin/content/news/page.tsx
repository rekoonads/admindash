"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Newspaper } from "lucide-react"

export default function NewsContentPage() {
  return (
    <ContentManagementPage
      title="News"
      description="Create and manage news articles."
      contentType="News"
      category="news"
      icon={Newspaper}
    />
  )
}