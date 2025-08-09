"use client"

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

  const siteOverview = {
    totalArticles: 2847,
    monthlyViews: "1.2M",
    activeUsers: "45.8K",
    engagement: 87,
  }

  const contentStats = [
    { category: "Gaming News", count: 1250, color: "bg-blue-500", icon: Gamepad2 },
    { category: "Reviews", count: 485, color: "bg-green-500", icon: Star },
    { category: "Videos", count: 320, color: "bg-red-500", icon: Video },
    { category: "Guides", count: 792, color: "bg-purple-500", icon: BookOpen },
  ]

  const trendingContent = [
    { title: "Spider-Man 2 Complete Review", category: "Reviews", views: "25.4K", engagement: 94 },
    { title: "Top 15 Indie Games 2024", category: "Gaming", views: "18.7K", engagement: 89 },
    { title: "Cyberpunk 2077 Ultimate Guide", category: "Guides", views: "16.2K", engagement: 92 },
    { title: "Nintendo Switch 2 Rumors", category: "News", views: "14.8K", engagement: 87 },
  ]

  const quickActions = [
    { title: "Create Gaming News", desc: "Write breaking gaming news", href: "/admin/content/news", color: "bg-blue-50 hover:bg-blue-100" },
    { title: "Add Game Review", desc: "Review latest games", href: "/admin/content/reviews", color: "bg-green-50 hover:bg-green-100" },
    { title: "Upload Video", desc: "Add gaming videos", href: "/admin/content/videos", color: "bg-red-50 hover:bg-red-100" },
    { title: "Write Guide", desc: "Create game guides", href: "/admin/content/game-guides", color: "bg-purple-50 hover:bg-purple-100" },
  ]

  const recentActivity = [
    { action: "Published", title: "Baldur's Gate 3 DLC Review", time: "2 hours ago", type: "Review" },
    { action: "Updated", title: "Elden Ring Boss Guide", time: "4 hours ago", type: "Guide" },
    { action: "Draft", title: "Gaming Industry Trends 2024", time: "6 hours ago", type: "News" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className={`flex ${isMobile ? 'flex-col gap-3' : 'items-center justify-between'}`}>
        <div>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
            KOODOS Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome back, {user?.firstName}! Manage your gaming content empire.</p>
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
            <div className="text-2xl font-bold">{siteOverview.totalArticles.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+127 this month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
            <Eye className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteOverview.monthlyViews}</div>
            <p className="text-xs text-muted-foreground">+23.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteOverview.activeUsers}</div>
            <p className="text-xs text-muted-foreground">+8.2% this week</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{siteOverview.engagement}%</div>
            <Progress value={siteOverview.engagement} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Distribution</CardTitle>
          <CardDescription>Overview of content across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
            {contentStats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-lg ${stat.color} text-white`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{stat.count}</p>
                    <p className="text-sm text-muted-foreground">{stat.category}</p>
                  </div>
                </div>
              )
            })}
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
              {trendingContent.map((content, index) => (
                <div key={index} className={`flex ${isMobile ? 'flex-col gap-2' : 'items-center justify-between'} p-3 border rounded-lg hover:bg-gray-50 transition-colors`}>
                  <div className="flex-1">
                    <h3 className="font-medium">{content.title}</h3>
                    <div className={`flex items-center gap-4 mt-1 text-sm text-muted-foreground ${isMobile ? 'flex-wrap' : ''}`}>
                      <Badge variant="secondary" className="text-xs">
                        {content.category}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {content.views}
                      </span>
                      <span>{content.engagement}% engagement</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className={isMobile ? 'self-start' : ''}>
                    View
                  </Button>
                </div>
              ))}
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
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="font-medium">
                    <span className="text-blue-600">{activity.action}</span> {activity.title}
                  </p>
                  <div className={`flex items-center gap-2 mt-1 text-sm text-muted-foreground ${isMobile ? 'flex-wrap' : ''}`}>
                    <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}