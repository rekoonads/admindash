"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Check, X, Search, Filter, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function CommentsPage() {
  const comments = [
    {
      id: 1,
      author: "GamerDude99",
      content: "Great review! I totally agree with your points on the gameplay.",
      post: "Elden Ring: A Masterpiece",
      status: "Pending",
      date: "2024-01-25",
    },
    {
      id: 2,
      author: "AnimeFanatic",
      content: "When is the next episode of that new anime coming out?",
      post: "Upcoming Anime Releases Q3",
      status: "Approved",
      date: "2024-01-24",
    },
    {
      id: 3,
      author: "TechGuru",
      content: "Interesting insights on AI. What are your thoughts on quantum computing?",
      post: "Deep Dive: AI in Gaming",
      status: "Pending",
      date: "2024-01-23",
    },
    {
      id: 4,
      author: "BookWorm",
      content: "This guide helped me so much! Thanks for the detailed tips.",
      post: "Beginner's Guide to Valorant Agents",
      status: "Approved",
      date: "2024-01-22",
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
          <p className="text-muted-foreground">Manage and moderate user comments</p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Comments</CardTitle>
          <div className="flex items-center gap-4 mt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search comments..." className="pl-8" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <Checkbox id={`select-${comment.id}`} className="mt-1" />
                <MessageCircle className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{comment.author}</span>
                    <Badge variant={comment.status === "Approved" ? "default" : "secondary"} className="text-xs">
                      {comment.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground ml-auto">{comment.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
                  <p className="text-xs text-muted-foreground">On: {comment.post}</p>
                  <div className="mt-3 flex gap-2">
                    {comment.status === "Pending" && (
                      <>
                        <Button variant="outline" size="sm">
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm">
                          <X className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline">Bulk Approve</Button>
            <Button variant="destructive">Bulk Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
