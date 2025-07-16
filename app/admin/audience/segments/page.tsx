"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Heart, MessageCircle, Share, MapPin, Smartphone, Tag } from "lucide-react"

export default function SegmentsPage() {
  const segmentData = [
    {
      user: "John Doe",
      location: "New York, USA",
      device: "iPhone 14",
      interests: ["Technology", "Sports"],
      interactions: {
        likes: 25,
        comments: 8,
        shares: 3,
        posts: ["Product Launch", "Tech News", "Sports Update"],
      },
    },
    {
      user: "Jane Smith",
      location: "London, UK",
      device: "Samsung Galaxy",
      interests: ["Fashion", "Travel"],
      interactions: {
        likes: 42,
        comments: 15,
        shares: 7,
        posts: ["Fashion Trends", "Travel Guide", "Style Tips"],
      },
    },
    {
      user: "Mike Johnson",
      location: "Toronto, Canada",
      device: "iPad Pro",
      interests: ["Business", "Finance"],
      interactions: {
        likes: 18,
        comments: 5,
        shares: 2,
        posts: ["Market Analysis", "Business News"],
      },
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audience Segments</h1>
          <p className="text-muted-foreground">
            Detailed analytics of user interactions, locations, devices, and interests
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Segment
        </Button>
      </div>

      {/* Interaction Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,285</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">428</div>
            <p className="text-xs text-muted-foreground">+8% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shares</CardTitle>
            <Share className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+15% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Segment Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>User Interaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Interests</TableHead>
                <TableHead>Interactions</TableHead>
                <TableHead>Top Posts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {segmentData.map((segment, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{segment.user}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{segment.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Smartphone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{segment.device}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {segment.interests.map((interest, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 text-sm">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {segment.interactions.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        {segment.interactions.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share className="h-3 w-3" />
                        {segment.interactions.shares}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {segment.interactions.posts.slice(0, 2).map((post, i) => (
                        <div key={i} className="text-xs text-muted-foreground">
                          {post}
                        </div>
                      ))}
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
