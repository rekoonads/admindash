"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Gamepad2 } from "lucide-react"

export default function XboxPage() {
  return (
    <ContentManagementPage
      title="Xbox Content"
      description="Manage Xbox Series X/S, Game Pass, and platform coverage"
      contentType="Xbox"
      category="xbox"
      icon={Gamepad2}
    />
  )
}