"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Gamepad2 } from "lucide-react"

export default function NintendoPage() {
  return (
    <ContentManagementPage
      title="Nintendo Content"
      description="Manage Nintendo Switch, games, and platform coverage"
      contentType="Nintendo Article"
      category="nintendo"
      icon={Gamepad2}
    />
  )
}