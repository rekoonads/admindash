"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Database, FileText, ImageIcon, Link } from "lucide-react"

export default function MetaobjectsPage() {
  const metaobjects = [
    {
      name: "Product Reviews",
      type: "Review",
      fields: 5,
      entries: 234,
      description: "Customer reviews and ratings for products",
    },
    {
      name: "FAQ Items",
      type: "FAQ",
      fields: 3,
      entries: 45,
      description: "Frequently asked questions and answers",
    },
    {
      name: "Team Members",
      type: "Person",
      fields: 7,
      entries: 12,
      description: "Company team member profiles and information",
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Metaobjects</h1>
          <p className="text-muted-foreground">Streamline content creation with metaobjects</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Metaobject
        </Button>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            What are Metaobjects?
          </CardTitle>
          <CardDescription>
            Metaobjects allow you to group fields and connect them to different parts of your store. Use them to create
            custom content or data structures.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <h3 className="font-medium">Custom Content</h3>
                <p className="text-sm text-muted-foreground">Create structured content types for your specific needs</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Link className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <h3 className="font-medium">Connected Data</h3>
                <p className="text-sm text-muted-foreground">Link metaobjects to products, pages, and other content</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ImageIcon className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <h3 className="font-medium">Rich Media</h3>
                <p className="text-sm text-muted-foreground">
                  Include images, videos, and other media in your structures
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metaobjects List */}
      <div className="grid gap-4">
        {metaobjects.map((metaobject, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{metaobject.name}</CardTitle>
                  <CardDescription>{metaobject.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    View Entries
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Type:</span> {metaobject.type}
                </div>
                <div>
                  <span className="font-medium">Fields:</span> {metaobject.fields}
                </div>
                <div>
                  <span className="font-medium">Entries:</span> {metaobject.entries}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
