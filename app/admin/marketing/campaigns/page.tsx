"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CampaignEditor } from "@/components/campaign-editor"
import { Plus, Search, MoreHorizontal, Edit, Copy, Trash2, Send } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Campaign {
  id: string
  name: string
  subject: string
  status: "draft" | "scheduled" | "sent"
  sentDate: string
  openRate?: number
  clickRate?: number
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Monthly Newsletter - January",
    subject: "New Year, New Gaming Adventures!",
    status: "sent",
    sentDate: "2024-01-15",
    openRate: 24.5,
    clickRate: 3.2,
  },
  {
    id: "2",
    name: "Weekly Gaming News",
    subject: "This Week in Gaming",
    status: "scheduled",
    sentDate: "2024-01-22",
  },
  {
    id: "3",
    name: "Product Launch Announcement",
    subject: "Exciting New Features Coming Soon",
    status: "draft",
    sentDate: "",
  },
]

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns)
  const [showEditor, setShowEditor] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      setCampaigns(prev => prev.filter(campaign => campaign.id !== id))
    }
  }

  const handleDuplicate = (campaign: Campaign) => {
    const newCampaign = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (Copy)`,
      status: "draft" as const,
      sentDate: "",
    }
    setCampaigns(prev => [...prev, newCampaign])
  }

  if (showEditor) {
    return (
      <CampaignEditor
        onSave={() => setShowEditor(false)}
        onClose={() => setShowEditor(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Email Campaigns</h1>
          <p className="text-muted-foreground">Create and manage your newsletter campaigns</p>
        </div>
        <Button onClick={() => setShowEditor(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Campaigns</CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead>Open Rate</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead className="w-[50px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-muted-foreground">{campaign.subject}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        campaign.status === "sent" ? "default" : 
                        campaign.status === "scheduled" ? "secondary" : "outline"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {campaign.sentDate || "Not sent"}
                  </TableCell>
                  <TableCell>
                    {campaign.openRate ? `${campaign.openRate}%` : "-"}
                  </TableCell>
                  <TableCell>
                    {campaign.clickRate ? `${campaign.clickRate}%` : "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(campaign)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        {campaign.status === "draft" && (
                          <DropdownMenuItem>
                            <Send className="h-4 w-4 mr-2" />
                            Send Now
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(campaign.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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