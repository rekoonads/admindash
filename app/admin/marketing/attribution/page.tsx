"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Eye, Download, TrendingUp, Users, MousePointer, DollarSign } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface CampaignMetrics {
  id: string
  name: string
  sentDate: string
  recipients: number
  opens: number
  clicks: number
  bounces: number
  revenue: number
  openRate: number
  clickRate: number
  bounceRate: number
}

const mockMetrics: CampaignMetrics[] = [
  {
    id: "1",
    name: "Monthly Newsletter - January",
    sentDate: "2024-01-15",
    recipients: 5420,
    opens: 1328,
    clicks: 174,
    bounces: 23,
    revenue: 2450,
    openRate: 24.5,
    clickRate: 3.2,
    bounceRate: 0.4,
  },
  {
    id: "2",
    name: "Product Launch Announcement",
    sentDate: "2024-01-10",
    recipients: 3200,
    opens: 896,
    clicks: 128,
    bounces: 15,
    revenue: 1890,
    openRate: 28.0,
    clickRate: 4.0,
    bounceRate: 0.5,
  },
]

const performanceData = [
  { date: "Jan 1", opens: 120, clicks: 15 },
  { date: "Jan 8", opens: 180, clicks: 22 },
  { date: "Jan 15", opens: 240, clicks: 31 },
  { date: "Jan 22", opens: 190, clicks: 25 },
  { date: "Jan 29", opens: 220, clicks: 28 },
]

const deviceData = [
  { device: "Mobile", percentage: 65 },
  { device: "Desktop", percentage: 30 },
  { device: "Tablet", percentage: 5 },
]

export default function AttributionPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignMetrics | null>(null)
  const [timeFilter, setTimeFilter] = useState("7d")

  const totalRevenue = mockMetrics.reduce((sum, campaign) => sum + campaign.revenue, 0)
  const avgOpenRate = mockMetrics.reduce((sum, campaign) => sum + campaign.openRate, 0) / mockMetrics.length
  const avgClickRate = mockMetrics.reduce((sum, campaign) => sum + campaign.clickRate, 0) / mockMetrics.length
  const totalRecipients = mockMetrics.reduce((sum, campaign) => sum + campaign.recipients, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Campaign Attribution</h1>
          <p className="text-muted-foreground">Track performance and ROI of your email campaigns</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Open Rate</p>
                <p className="text-2xl font-bold">{avgOpenRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Click Rate</p>
                <p className="text-2xl font-bold">{avgClickRate.toFixed(1)}%</p>
              </div>
              <MousePointer className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Recipients</p>
                <p className="text-2xl font-bold">{totalRecipients.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="opens" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Campaign Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMetrics.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.sentDate}</TableCell>
                  <TableCell>{campaign.recipients.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{campaign.openRate}%</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{campaign.clickRate}%</Badge>
                  </TableCell>
                  <TableCell>${campaign.revenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedCampaign(campaign)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Report
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>{campaign.name} - Detailed Report</DialogTitle>
                          <DialogDescription>
                            Campaign performance metrics and analytics
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="text-center p-4 border rounded">
                                <p className="text-2xl font-bold text-blue-600">{campaign.opens}</p>
                                <p className="text-sm text-muted-foreground">Total Opens</p>
                              </div>
                              <div className="text-center p-4 border rounded">
                                <p className="text-2xl font-bold text-green-600">{campaign.clicks}</p>
                                <p className="text-sm text-muted-foreground">Total Clicks</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium">Device Breakdown</h4>
                              <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={deviceData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="device" />
                                  <YAxis />
                                  <Tooltip />
                                  <Bar dataKey="percentage" fill="#3b82f6" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <h4 className="font-medium">Campaign Details</h4>
                              <div className="space-y-1 text-sm">
                                <p><span className="font-medium">Sent:</span> {campaign.sentDate}</p>
                                <p><span className="font-medium">Recipients:</span> {campaign.recipients.toLocaleString()}</p>
                                <p><span className="font-medium">Bounce Rate:</span> {campaign.bounceRate}%</p>
                                <p><span className="font-medium">Revenue:</span> ${campaign.revenue.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <h4 className="font-medium">Top Links Clicked</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Product Page</span>
                                  <span>45 clicks</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Blog Article</span>
                                  <span>32 clicks</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Contact Us</span>
                                  <span>18 clicks</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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