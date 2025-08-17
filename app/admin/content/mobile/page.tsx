"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Smartphone } from "lucide-react"

export default function MobilePage() {
  return (
    <ContentManagementPage
      title="Mobile Gaming Content"
      description="Manage mobile games, iOS, Android gaming coverage"
      contentType="Mobile Gaming Article"
      category="mobile"
      icon={Smartphone}
    />
  )
}