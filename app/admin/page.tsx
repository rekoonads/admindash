"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Eye, TrendingUp, FileText, Clock, Gamepad2, Star, Video, BookOpen, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useIsMobile } from "@/components/ui/use-mobile"
import { useUser } from "@clerk/nextjs"

export default function AdminDashboard() {
  const isMobile = useIsMobile()
  const { user } = useUser()
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalViews: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [analyticsRes, articlesRes] = await Promise.all([
          fetch('/api/analytics'),
          fetch('/api/articles')
        ])
        
        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json()
          if (analyticsData.success) {
            setStats(analyticsData.data.overview)
          }
        }
        
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json()
          
          // Process content stats by category
          const categoryStats: any = {}
          articlesData.forEach((article: any) => {
            // Ensure we get a string value, not an object
            const categoryName = typeof article.category === 'object' && article.category?.name 
              ? article.category.name 
              : typeof article.category_id === 'string' 
              ? article.category_id 
              : 'Other'
            categoryStats[categoryName] = (categoryStats[categoryName] || 0) + 1
          })
          
          const contentStatsData = Object.entries(categoryStats).map(([category, count], index) => ({
            category: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' '),
            count,
            color: ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-purple-500'][index % 4],
            icon: [Gamepad2, Star, Video, BookOpen][index % 4]
          }))
          setContentStats(contentStatsData)
          
          // Get trending content (top viewed articles)
          const trending = articlesData
            .filter((article: any) => article.status === 'PUBLISHED')
            .sort((a: any, b: any) => (b.views || 0) - (a.views || 0))
            .slice(0, 4)
            .map((article: any) => ({
              title: article.title || 'Untitled',
              category: typeof article.category === 'object' && article.category?.name 
                ? article.category.name 
                : typeof article.category_id === 'string' 
                ? article.category_id.replace('-', ' ') 
                : 'General',
              views: (article.views || 0).toLocaleString(),
              engagement: Math.floor(Math.random() * 20) + 80, // Placeholder for engagement
              slug: article.slug
            }))
          setTrendingContent(trending)
          
          // Get recent activity
          const recent = articlesData
            .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            .slice(0, 5)
            .map((article: any) => ({
              action: article.status === 'PUBLISHED' ? 'Published' : 'Updated',
              title: article.title,
              time: new Date(article.updated_at).toLocaleString(),
              type: article.type || 'Article'
            }))
          setRecentActivity(recent)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const [contentStats, setContentStats] = useState<any[]>([])
  const [trendingContent, setTrendingContent] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [categoryStats, setCategoryStats] = useState<any>({})

  const quickActions = [
    { title: "Create Gaming News", desc: "Write breaking gaming news", href: "/admin/content/news", color: "bg-blue-50 hover:bg-blue-100" },
    { title: "Add Game Review", desc: "Review latest games", href: "/admin/content/reviews", color: "bg-green-50 hover:bg-green-100" },
    { title: "Upload Video", desc: "Add gaming videos", href: "/admin/content/videos", color: "bg-red-50 hover:bg-red-100" },
    { title: "Write Guide", desc: "Create game guides", href: "/admin/content/game-guides", color: "bg-purple-50 hover:bg-purple-100" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'}`}>
        <div>
          <div className="space-y-2">
            <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-gray-900`}>
              Welcome back, {user?.firstName || user?.username || 'User'}!
            </h1>
            <p className="text-sm text-gray-600">
              Last login: {new Date().toLocaleDateString('en-US', { 
                month: 'numeric', 
                day: 'numeric', 
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Zap className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>
      </div>

      <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalArticles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stats.publishedArticles} published</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total views</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stats.draftArticles}</div>
            <p className="text-xs text-muted-foreground">Draft articles</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : Math.round((stats.publishedArticles / stats.totalArticles) * 100)}%</div>
            <Progress value={stats.totalArticles > 0 ? (stats.publishedArticles / stats.totalArticles) * 100 : 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Distribution</CardTitle>
          <CardDescription>Overview of content across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
            {contentStats.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No content statistics available</p>
              </div>
            ) : (
              contentStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="flex items-center gap-3 p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-lg ${stat.color} text-white flex-shrink-0`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm sm:text-base">{stat.count}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.category}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'}`}>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Create new content quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`justify-start h-auto p-4 ${action.color}`}
                  asChild
                >
                  <a href={action.href}>
                    <div className="text-left">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-sm text-muted-foreground">{action.desc}</p>
                    </div>
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trending Content
            </CardTitle>
            <CardDescription>Top performing content this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trendingContent.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No trending content yet</p>
                </div>
              ) : (
                trendingContent.map((content, index) => (
                  <div key={index} className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center justify-between'} p-3 border rounded-lg hover:bg-gray-50 transition-colors`}>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{content.title}</h3>
                      <div className={`flex items-center gap-2 sm:gap-4 mt-1 text-sm text-muted-foreground ${isMobile ? 'flex-wrap' : ''}`}>
                        <Badge variant="secondary" className="text-xs">
                          {content.category}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {content.views}
                        </span>
                        <span className="hidden sm:inline">{content.engagement}% engagement</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className={`${isMobile ? 'self-start mt-2' : ''} flex-shrink-0`}>
                      View
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest content updates and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 sm:gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base">
                      <span className="text-blue-600">{activity.action}</span>{' '}
                      <span className="break-words">{activity.title}</span>
                    </p>
                    <div className={`flex items-center gap-2 mt-1 text-xs sm:text-sm text-muted-foreground ${isMobile ? 'flex-wrap' : ''}`}>
                      <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                      <span className="truncate">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}