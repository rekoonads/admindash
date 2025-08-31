"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { MessageSquare } from "lucide-react"

export default function OpinionsPage() {
  return (
    <ContentManagementPage
      title="Opinions"
      description="Manage editorial opinions with debate-style layout and engagement tracking"
      contentType="Opinion"
      category="opinions"
      icon={MessageSquare}

    />
  )
}