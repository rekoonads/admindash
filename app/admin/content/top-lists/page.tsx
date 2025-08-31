"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { List } from "lucide-react"

export default function TopListsPage() {
  return (
    <ContentManagementPage
      title="Top Lists"
      description="Manage curated top lists and rankings"
      contentType="Top List"
      category="top-lists"
      icon={List}
    />
  )
}