"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CheckCircle } from 'lucide-react'

export default function SeoIssues() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    try {
      const response = await fetch('/api/seo/issues')
      const data = await response.json()
      setArticles(data.articles || [])
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SEO Issues</h1>
        <p className="text-muted-foreground">Articles with SEO problems</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Issues Found ({articles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((article: any) => (
                <TableRow key={article.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{article.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {article.category?.name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {!article.meta_description && (
                        <Badge variant="destructive">Missing Meta Description</Badge>
                      )}
                      {article.meta_description && article.meta_description.length > 160 && (
                        <Badge variant="secondary">Meta Too Long</Badge>
                      )}
                      {article.meta_description && article.meta_description.length < 120 && (
                        <Badge variant="outline">Meta Too Short</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      onClick={() => window.location.href = `/admin/seo/meta`}
                    >
                      Fix Issues
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