"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Check, X, Sparkles } from 'lucide-react'

export default function SeoSuggestions() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSuggestions()
  }, [])

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('/api/seo/meta-management')
      const data = await response.json()
      const articlesWithoutMeta = data.articles?.filter((a: any) => !a.meta_description) || []
      setArticles(articlesWithoutMeta)
    } finally {
      setLoading(false)
    }
  }

  const generateAll = async () => {
    for (const article of articles) {
      try {
        await fetch('/api/seo/suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageId: article.id })
        })
      } catch (error) {
        console.error('Failed to generate for:', article.id)
      }
    }
    fetchSuggestions()
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Suggestions</h1>
          <p className="text-muted-foreground">Generate meta descriptions with AI</p>
        </div>
        <Button onClick={generateAll} disabled={articles.length === 0}>
          <Sparkles className="h-4 w-4 mr-2" />
          Generate All ({articles.length})
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Articles Needing Meta Descriptions</CardTitle>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              All articles have meta descriptions!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Article</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article: any) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div className="font-medium">{article.title}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{article.category?.name}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">Missing Meta</Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm"
                        onClick={() => window.location.href = `/admin/seo/meta`}
                      >
                        Edit Meta
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}