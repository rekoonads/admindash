"use client"

import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Search, UserPlus, Shield, Mail, Calendar } from "lucide-react"
import { useState, useEffect } from "react"

export default function UsersPage() {
  const { user } = useUser()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const mockUsers = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      emailAddresses: [{ emailAddress: "john@example.com" }],
      imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      createdAt: new Date().toISOString(),
      publicMetadata: { role: "admin" }
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      emailAddresses: [{ emailAddress: "jane@example.com" }],
      imageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      createdAt: new Date().toISOString(),
      publicMetadata: { role: "editor" }
    }
  ]

  useEffect(() => {
    setUsers(mockUsers)
  }, [])

  const filteredUsers = users.filter(u => 
    u.emailAddresses?.[0]?.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleBadge = (role) => {
    const variants = {
      admin: "destructive",
      editor: "default", 
      author: "secondary",
      user: "outline"
    }
    return <Badge variant={variants[role] || "outline"}>{role || "user"}</Badge>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground">Manage users and permissions with Clerk</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Users ({filteredUsers.length})
              </div>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite User
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={u.imageUrl}
                        alt={u.firstName || "User"}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium">
                          {u.firstName} {u.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {u.emailAddresses?.[0]?.emailAddress}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getRoleBadge(u.publicMetadata?.role)}
                      <Button variant="outline" size="sm">
                        <Shield className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}