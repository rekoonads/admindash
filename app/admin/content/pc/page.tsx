"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Monitor } from "lucide-react"

export default function PCPage() {
  return (
    <ContentManagementPage
      title="PC Gaming Content"
      description="Manage PC gaming news, reviews, and hardware coverage"
      contentType="PC Gaming Article"
      category="pc"
      icon={Monitor}
    />
  )
}