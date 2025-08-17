"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Gamepad2 } from "lucide-react"

export default function PlayStationPage() {
  return (
    <ContentManagementPage
      title="PlayStation Content"
      description="Manage PS5, PS4, and PlayStation platform coverage"
      contentType="PlayStation Article"
      category="playstation"
      icon={Gamepad2}
    />
  )
}