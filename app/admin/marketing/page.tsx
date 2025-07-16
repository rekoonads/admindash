"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, TrendingUp, DollarSign, Users, MousePointer, Eye } from "lucide-react"

export default function MarketingPage() {
  const marketingMetrics = {
    onlineStoreSessions: "12,847",
    conversionRate: "3.2%",
    averageOrderValue: "$89.50",
    totalSales: "$45,231",
    salesAttributedToMarketing: "$32,450",
    ordersAttributedToMarketing: "362",
  }

  const topChannels = [
    { name: "Google Ads", cost: "$2,450", clicks: "8,234", impressions: "125,000", conversions: "145" },
    { name: "Facebook Ads", cost: "$1,890", clicks: "6,123", impressions: "98,000", conversions: "112" },
    { name: "Email Marketing", cost: "$450", clicks: "3,456", impressions: "45,000", conversions: "89" },
    { name: "Instagram Ads", cost: "$1,200", clicks: "4,567", impressions: "67,000", conversions: "76" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Overview</h1>
          <p className="text-muted-foreground">Track your marketing performance and ROI</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online Store Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketingMetrics.onlineStoreSessions}</div>
            <p className="text-xs text-muted-foreground">+15.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketingMetrics.conversionRate}</div>
            <p className="text-xs text-muted-foreground">+0.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketingMetrics.averageOrderValue}</div>
            <p className="text-xs text-muted-foreground">+$5.20 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketingMetrics.totalSales}</div>
            <p className="text-xs text-muted-foreground">+12.8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales from Marketing</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketingMetrics.salesAttributedToMarketing}</div>
            <p className="text-xs text-muted-foreground">71.8% of total sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders from Marketing</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketingMetrics.ordersAttributedToMarketing}</div>
            <p className="text-xs text-muted-foreground">68.5% of total orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Marketing Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Top Marketing Channels</CardTitle>
          <p className="text-sm text-muted-foreground">
            Cost, click, and impression metrics for your marketing channels
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topChannels.map((channel, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{channel.name}</h3>
                  <div className="grid grid-cols-4 gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>Cost: {channel.cost}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MousePointer className="h-3 w-3" />
                      <span>Clicks: {channel.clicks}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>Impressions: {channel.impressions}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>Conversions: {channel.conversions}</span>
                    </div>
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
