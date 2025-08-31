"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Wand2, RefreshCw } from "lucide-react"

interface SEOGeneratorProps {
  title: string
  content: string
  articleId?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  onGenerated?: (data: { metaDescription: string; keywords: string[]; seoTitle: string }) => void
  onUpdate?: (field: string, value: string) => void
}

export function SEOGenerator({ 
  title, 
  content, 
  articleId, 
  metaTitle = "",
  metaDescription = "",
  metaKeywords = "",
  onGenerated, 
  onUpdate 
}: SEOGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [seoTitle, setSeoTitle] = useState(metaTitle)
  const [description, setDescription] = useState(metaDescription)
  const [keywords, setKeywords] = useState(metaKeywords)
  const [generatedKeywords, setGeneratedKeywords] = useState<string[]>([])

  const generateSEO = async () => {
    if (!title.trim()) {
      alert('Please enter a title first')
      return
    }
    
    setLoading(true)
    try {
      // Mock AI generation for now - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const generatedTitle = title.length > 50 ? `${title.substring(0, 47)}...` : `${title} - Guide`
      const generatedDesc = `I explored ${title} and found key insights. Honest review with practical takeaways you can use.`
      const generatedTags = [title.toLowerCase().split(' ')[0], 'review', 'guide', 'tips']
      
      setSeoTitle(generatedTitle)
      setDescription(generatedDesc)
      setGeneratedKeywords(generatedTags)
      setKeywords(generatedTags.join(', '))
      
      onUpdate?.('metaTitle', generatedTitle)
      onUpdate?.('metaDescription', generatedDesc)
      onUpdate?.('metaKeywords', generatedTags.join(', '))
      
      onGenerated?.({
        seoTitle: generatedTitle,
        metaDescription: generatedDesc,
        keywords: generatedTags
      })
    } catch (error) {
      console.error('SEO generation failed:', error)
      alert('Failed to generate SEO content. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTitleChange = (value: string) => {
    setSeoTitle(value)
    onUpdate?.('metaTitle', value)
  }

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    onUpdate?.('metaDescription', value)
  }

  const handleKeywordsChange = (value: string) => {
    setKeywords(value)
    onUpdate?.('metaKeywords', value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            SEO Optimization
          </div>
          <Badge variant="outline" className="text-xs">
            Powered by Llama 4 Maverick 17B
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3">
          <Button 
            onClick={generateSEO} 
            disabled={loading || !title.trim()} 
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                AI SEO Generator
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Generate SEO
              </>
            )}
          </Button>
          
          <div className="seo-generator-buttons">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={loading}
              onClick={() => generateSEO()}
              className="ai-generate-button"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Generate Tags
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-green-600 border-green-200 hover:bg-green-50 ai-generate-button"
            >
              Ready
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Meta Title</Label>
              <span className={`character-counter ${
                seoTitle.length > 60 ? 'error' : 
                seoTitle.length > 50 ? 'warning' : 'optimal'
              }`}>
                {seoTitle.length}/60
              </span>
            </div>
            <Input
              value={seoTitle}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter SEO title..."
              className="text-sm"
            />
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 text-xs text-blue-600"
              onClick={() => setSeoTitle(title)}
            >
              Adjust length
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Meta Description</Label>
              <span className={`character-counter ${
                description.length > 160 ? 'error' : 
                description.length > 140 ? 'warning' : 'optimal'
              }`}>
                {description.length}/160
              </span>
            </div>
            <Textarea
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Enter meta description..."
              rows={3}
              className="text-sm resize-none"
            />
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 text-xs text-blue-600"
              onClick={() => setDescription(description.substring(0, 160))}
            >
              Adjust length
            </Button>
          </div>


        </div>
      </CardContent>
    </Card>
  )
}