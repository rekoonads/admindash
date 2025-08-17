"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Globe } from "lucide-react"

export default function WikiPage() {
  return (
    <ContentManagementPage
      title="Wiki"
      description="Manage wiki articles and reference content"
      contentType="Wiki Article"
      category="wiki"
      icon={Globe}
    />
  )
}