"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Globe, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface SeoStats {
  totalPages: number
  missingMeta: number
  pendingSuggestions: number
  criticalIssues: number
}

export default function SeoOverviewPage() {
  const [stats, setStats] = useState<SeoStats>({
    totalPages: 0,
    missingMeta: 0,
    pendingSuggestions: 0,
    criticalIssues: 0
  })
  const [crawlUrl, setCrawlUrl] = useState('https://koodos.in')
  const [crawling, setCrawling] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/seo/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const startCrawl = async () => {
    setCrawling(true)
    try {
      const response = await fetch('/api/seo/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseUrl: crawlUrl, maxPages: 100 })
      })
      const result = await response.json()
      console.log('Crawl started:', result)
      setTimeout(fetchStats, 2000)
    } catch (error) {
      console.error('Crawl failed:', error)
    } finally {
      setCrawling(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SEO Management</h1>
          <p className="text-muted-foreground">Manage meta descriptions and SEO optimization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Meta</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.missingMeta}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Suggestions</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingSuggestions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticalIssues}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content SEO Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Analyze all published articles and content pages for SEO optimization.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="https://koodos.in"
              value={crawlUrl}
              onChange={(e) => setCrawlUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={startCrawl} disabled={crawling}>
              {crawling ? 'Generating with Nova Micro...' : 'Generate SEO with AI'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/admin/seo/meta'}>
              <Search className="h-4 w-4 mr-2" />
              Manage Meta Descriptions
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/admin/seo/issues'}>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Review Issues
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/admin/seo/suggestions'}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Suggestions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Last crawl completed</span>
                <Badge variant="secondary">2 hours ago</Badge>
              </div>
              <div className="flex justify-between">
                <span>Meta descriptions updated</span>
                <Badge variant="secondary">15 pages</Badge>
              </div>
              <div className="flex justify-between">
                <span>New issues found</span>
                <Badge variant="destructive">3 critical</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}