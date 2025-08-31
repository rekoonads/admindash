"use client"

import { TitleGenerator } from "@/components/title-generator"
import { AIContentGeneratorComponent } from "@/components/ai-content-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wand2, Lightbulb, Target, Sparkles } from "lucide-react"

export default function ToolsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Wand2 className="h-6 w-6" />
          Content Creation Tools
        </h1>
        <p className="text-muted-foreground">
          AI-powered tools to help create engaging content faster
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AIContentGeneratorComponent />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TitleGenerator />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                SEO Keywords
              </CardTitle>
              <CardDescription>
                Generate SEO-optimized keywords for better search rankings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Content Ideas
              </CardTitle>
              <CardDescription>
                Get fresh content ideas based on trending topics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p><strong>Title Generator:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Use 2-4 relevant keywords for best results</li>
                  <li>Select the appropriate content type</li>
                  <li>Try different keyword combinations</li>
                  <li>Copy or use titles directly in your content</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </div>
    </div>
  )
}