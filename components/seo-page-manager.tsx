"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Check, X, Edit, Sparkles, ExternalLink } from 'lucide-react'

interface SeoPage {
  id: string
  url: string
  title: string
  current_meta: string
  suggestions: MetaSuggestion[]
  issues: SeoIssue[]
}

interface MetaSuggestion {
  id: string
  suggestion: string
  status: string
  confidence: number
}

interface SeoIssue {
  type: string
  severity: string
  description: string
}

export function SeoPageManager() {
  const [pages, setPages] = useState<SeoPage[]>([])
  const [loading, setLoading] = useState(true)
  const [editingMeta, setEditingMeta] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/seo/pages')
      const data = await response.json()
      setPages(data.pages)
    } catch (error) {
      console.error('Failed to fetch pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSuggestion = async (pageId: string) => {
    try {
      await fetch('/api/seo/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId })
      })
      fetchPages()
    } catch (error) {
      console.error('Failed to generate suggestion:', error)
    }
  }

  const approveSuggestion = async (suggestionId: string, status: string, editedText?: string) => {
    try {
      await fetch('/api/seo/suggestions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: suggestionId, 
          status, 
          editedText,
          approvedBy: 'admin'
        })
      })
      fetchPages()
      setEditingMeta(null)
    } catch (error) {
      console.error('Failed to update suggestion:', error)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'destructive'
      case 'HIGH': return 'destructive'
      case 'MEDIUM': return 'secondary'
      default: return 'outline'
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Pages Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Current Meta</TableHead>
                <TableHead>AI Suggestion</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pages.map((page) => (
                <TableRow key={page.id}>
                  <TableCell className="max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{page.url}</span>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {page.title}
                    </div>
                  </TableCell>
                  
                  <TableCell className="max-w-sm">
                    {page.current_meta ? (
                      <div className="text-sm">
                        {page.current_meta}
                        <div className="text-xs text-muted-foreground mt-1">
                          {page.current_meta.length} chars
                        </div>
                      </div>
                    ) : (
                      <Badge variant="destructive">Missing</Badge>
                    )}
                  </TableCell>
                  
                  <TableCell className="max-w-sm">
                    {page.suggestions.length > 0 ? (
                      <div className="space-y-2">
                        {page.suggestions.map((suggestion) => (
                          <div key={suggestion.id} className="border rounded p-2">
                            {editingMeta === suggestion.id ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="text-sm"
                                  rows={3}
                                />
                                <div className="flex gap-1">
                                  <Button 
                                    size="sm" 
                                    onClick={() => approveSuggestion(suggestion.id, 'EDITED', editText)}
                                  >
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => setEditingMeta(null)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="text-sm">{suggestion.suggestion}</div>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="text-xs text-muted-foreground">
                                    {suggestion.suggestion.length} chars • {Math.round(suggestion.confidence * 100)}% confidence
                                  </div>
                                  <div className="flex gap-1">
                                    <Button 
                                      size="sm" 
                                      onClick={() => approveSuggestion(suggestion.id, 'APPROVED')}
                                    >
                                      <Check className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => {
                                        setEditingMeta(suggestion.id)
                                        setEditText(suggestion.suggestion)
                                      }}
                                    >
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => approveSuggestion(suggestion.id, 'REJECTED')}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => generateSuggestion(page.id)}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Generate
                      </Button>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      {page.issues.map((issue, idx) => (
                        <Badge key={idx} variant={getSeverityColor(issue.severity)}>
                          {issue.type}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}