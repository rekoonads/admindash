"use client"

import { SeoPageManager } from '@/components/seo-page-manager'

export default function SeoPages() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SEO Pages</h1>
        <p className="text-muted-foreground">Manage meta descriptions for all content pages</p>
      </div>
      <SeoPageManager />
    </div>
  )
}