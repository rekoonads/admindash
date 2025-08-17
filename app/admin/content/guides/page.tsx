"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { HelpCircle } from "lucide-react"

export default function GuidesPage() {
  return (
    <ContentManagementPage
      title="Guides"
      description="Manage comprehensive guides and tutorials"
      contentType="Guide"
      category="guides"
      icon={HelpCircle}
    />
  )
}