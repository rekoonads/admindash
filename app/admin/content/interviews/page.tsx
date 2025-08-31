"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { Mic } from "lucide-react"

export default function InterviewsPage() {
  return (
    <ContentManagementPage
      title="Interviews"
      description="Manage exclusive interviews with timeline layout and participant information"
      contentType="Interview"
      category="interviews"
      icon={Mic}

    />
  )
}