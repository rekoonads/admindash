"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Monitor } from "lucide-react"

export default function TechPage() {
  return (
    <ContentManagementPage
      title="Tech Content"
      description="Manage technology news, reviews, and features"
      contentType="Tech Article"
      category="tech"
      icon={Monitor}
    />
  )
}