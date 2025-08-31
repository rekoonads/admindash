"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Save, Sparkles, ExternalLink, Search } from 'lucide-react'

interface Article {
  id: string
  title: string
  slug: string
  meta_description: string
  excerpt: string
  category: { name: string, slug: string }
  status: string
}

export default function MetaManagement() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/seo/meta-management')
      const data = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error('Failed to fetch articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateMeta = async (id: string, metaDescription: string) => {
    try {
      await fetch('/api/seo/meta-management', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, meta_description: metaDescription })
      })
      fetchArticles()
      setEditingId(null)
    } catch (error) {
      console.error('Failed to update meta:', error)
    }
  }

  const generateMeta = async (id: string) => {
    try {
      const response = await fetch('/api/seo/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: id })
      })
      const result = await response.json()
      if (result.suggestion) {
        fetchArticles()
      }
    } catch (error) {
      console.error('Failed to generate meta:', error)
    }
  }

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meta Description Management</h1>
          <p className="text-muted-foreground">Manage meta descriptions for all articles</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Articles ({filteredArticles.length})</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead>Meta Description</TableHead>
                <TableHead>Length</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredArticles.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="max-w-xs">
                    <div>
                      <div className="font-medium truncate">{article.title}</div>
                      <div className="text-sm text-muted-foreground">
                        <Badge variant="outline" className="mr-2">{article.category?.name || 'Uncategorized'}</Badge>
                        {article.slug}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="max-w-md">
                    {editingId === article.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          placeholder="Enter meta description..."
                          className="min-h-[80px]"
                          maxLength={160}
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => updateMeta(article.id, editText)}
                          >
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        className="cursor-pointer hover:bg-muted p-2 rounded"
                        onClick={() => {
                          setEditingId(article.id)
                          setEditText(article.meta_description || article.excerpt || '')
                        }}
                      >
                        {article.meta_description ? (
                          <div className="text-sm">{article.meta_description}</div>
                        ) : (
                          <div className="text-sm text-muted-foreground italic">
                            {article.excerpt ? `Using excerpt: ${article.excerpt.substring(0, 100)}...` : 'No meta description'}
                          </div>
                        )}
                      </div>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <span className={
                        (article.meta_description?.length || 0) > 160 ? 'text-red-600' :
                        (article.meta_description?.length || 0) < 120 ? 'text-yellow-600' :
                        'text-green-600'
                      }>
                        {article.meta_description?.length || 0}/160
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => generateMeta(article.id)}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Generate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.open(`/article/${article.category.slug}/${article.slug}`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
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