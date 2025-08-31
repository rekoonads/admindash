"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PressPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Press</h1>
        <p className="text-muted-foreground">Manage press releases and media kit</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Press Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="company-info">Company Information</Label>
              <Textarea id="company-info" rows={5} placeholder="Enter company background and mission..." />
            </div>
            <div>
              <Label htmlFor="press-contact">Press Contact</Label>
              <Input id="press-contact" type="email" placeholder="press@koodos.com" />
            </div>
            <div>
              <Label htmlFor="media-kit">Media Kit URL</Label>
              <Input id="media-kit" placeholder="https://koodos.com/media-kit" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}