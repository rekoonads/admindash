"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Palette } from "lucide-react"

export default function CosplayPage() {
  return (
    <ContentManagementPage
      title="Cosplay Content"
      description="Manage cosplay features, galleries, and coverage"
      contentType="Cosplay"
      category="cosplay"
      icon={Palette}
    />
  )
}