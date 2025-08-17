"use client"

import { ContentManagementPage } from "@/components/content-management-page"
import { MessageCircle } from "lucide-react"

export default function InterviewsPage() {
  return (
    <ContentManagementPage
      title="Interviews"
      description="Manage exclusive interviews with industry professionals"
      contentType="Interview"
      category="interviews"
      icon={MessageCircle}
    />
  )
}