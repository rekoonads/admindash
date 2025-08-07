"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, Plus } from "lucide-react"

export default function MobilePage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Smartphone className="h-8 w-8 text-purple-600" />
            Mobile Gaming Content
          </h1>
          <p className="text-muted-foreground">Manage mobile gaming content for iOS and Android</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Mobile Content
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Mobile News</CardTitle>
            <CardDescription>Mobile gaming industry news</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">52</p>
            <p className="text-xs text-muted-foreground">Published articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mobile Reviews</CardTitle>
            <CardDescription>iOS and Android game reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">38</p>
            <p className="text-xs text-muted-foreground">Published reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mobile Guides</CardTitle>
            <CardDescription>Mobile gaming guides and tips</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">29</p>
            <p className="text-xs text-muted-foreground">Published guides</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}