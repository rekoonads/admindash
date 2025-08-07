"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Plus, Search, Filter, Eye, Trash2 } from "lucide-react"

export default function DiscussionsPage() {
  const discussions = [
    {
      id: 1,
      title: "What are your thoughts on the new gaming console?",
      author: "GamerX",
      replies: 56,
      views: 1200,
      status: "Open",
      date: "2024-01-20",
    },
    {
      id: 2,
      title: "Best anime of 2023?",
      author: "AnimeLover",
      replies: 32,
      views: 850,
      status: "Open",
      date: "2024-01-18",
    },
    {
      id: 3,
      title: "Tips for optimizing PC performance",
      author: "TechWizard",
      replies: 15,
      views: 600,
      status: "Closed",
      date: "2024-01-15",
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Discussions</h1>
          <p className="text-muted-foreground">Manage forum discussions and topics</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Discussion
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Discussions</CardTitle>
          <div className="flex items-center gap-4 mt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search discussions..." className="pl-8" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div key={discussion.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <MessageCircle className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{discussion.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>By {discussion.author}</span>
                      <span>{discussion.replies} replies</span>
                      <span>{discussion.views} views</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={discussion.status === "Open" ? "default" : "secondary"}>{discussion.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
