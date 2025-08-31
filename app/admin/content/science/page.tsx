"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Atom } from "lucide-react"

export default function SciencePage() {
  return (
    <ContentManagementPage
      title="Science & Comics"
      description="Manage science articles and comic book content"
      contentType="Science & Comics"
      category="science-comics"
      icon={Atom}
    />
  )
}