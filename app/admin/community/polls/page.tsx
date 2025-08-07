"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Vote, Plus, Search, Filter, Eye, Trash2 } from "lucide-react"

export default function PollsPage() {
  const polls = [
    {
      id: 1,
      question: "Which is your favorite gaming platform?",
      status: "Active",
      votes: 1200,
      options: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
      date: "2024-01-10",
    },
    {
      id: 2,
      question: "What's your preferred content format?",
      status: "Closed",
      votes: 850,
      options: ["Articles", "Videos", "Podcasts"],
      date: "2023-12-25",
    },
    {
      id: 3,
      question: "Should we add a new 'Comics' section?",
      status: "Active",
      votes: 600,
      options: ["Yes", "No", "Maybe"],
      date: "2024-01-05",
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Polls</h1>
          <p className="text-muted-foreground">Create and manage community polls</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Poll
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Polls</CardTitle>
          <div className="flex items-center gap-4 mt-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search polls..." className="pl-8" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
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
            {polls.map((poll) => (
              <div key={poll.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Vote className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{poll.question}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{poll.votes} votes</span>
                      <span>Options: {poll.options.join(", ")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={poll.status === "Active" ? "default" : "secondary"}>{poll.status}</Badge>
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
