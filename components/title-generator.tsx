"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Wand2, Copy, Check } from "lucide-react"

interface TitleGeneratorProps {
  onTitleSelect?: (title: string) => void
}

export function TitleGenerator({ onTitleSelect }: TitleGeneratorProps) {
  const [keywords, setKeywords] = useState("")
  const [contentType, setContentType] = useState("guide")
  const [loading, setLoading] = useState(false)
  const [generatedTitles, setGeneratedTitles] = useState<string[]>([])
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const generateTitles = async () => {
    if (!keywords.trim()) {
      alert('Please enter keywords first')
      return
    }
    
    setLoading(true)
    try {
      const keywordArray = keywords.split(',').map(k => k.trim()).filter(Boolean)
      
      const response = await fetch('/api/titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          keywords: keywordArray, 
          contentType, 
          count: 8 
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setGeneratedTitles(data.titles)
      } else {
        alert('Failed to generate titles: ' + data.error)
      }
    } catch (error) {
      console.error('Title generation failed:', error)
      alert('Failed to generate titles')
    } finally {
      setLoading(false)
    }
  }

  const copyTitle = async (title: string, index: number) => {
    try {
      await navigator.clipboard.writeText(title)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const selectTitle = (title: string) => {
    onTitleSelect?.(title)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-500" />
          AI Title Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Keywords</Label>
            <Input
              placeholder="gaming, zelda, nintendo, review..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Separate with commas</p>
          </div>
          
          <div className="space-y-2">
            <Label>Content Type</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="news">News</SelectItem>
                <SelectItem value="list">Top List</SelectItem>
                <SelectItem value="comparison">Comparison</SelectItem>
                <SelectItem value="tutorial">Tutorial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          onClick={generateTitles} 
          disabled={loading || !keywords.trim()} 
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Titles...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Titles
            </>
          )}
        </Button>

        {generatedTitles.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Generated Titles</Label>
              <Badge variant="secondary" className="text-xs">
                {generatedTitles.length} suggestions
              </Badge>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {generatedTitles.map((title, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm flex-1 pr-2">{title}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyTitle(title, index)}
                      className="h-8 w-8 p-0"
                    >
                      {copiedIndex === index ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    {onTitleSelect && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => selectTitle(title)}
                        className="text-xs"
                      >
                        Use
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}