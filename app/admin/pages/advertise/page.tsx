"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdvertisePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Advertise With Us</h1>
        <p className="text-muted-foreground">Manage advertising information and packages</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Advertising Packages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="banner-rates">Banner Ad Rates</Label>
              <Textarea id="banner-rates" rows={4} placeholder="Enter banner advertising rates and specifications..." />
            </div>
            <div>
              <Label htmlFor="sponsored-content">Sponsored Content</Label>
              <Textarea id="sponsored-content" rows={4} placeholder="Enter sponsored content information..." />
            </div>
            <div>
              <Label htmlFor="contact-sales">Sales Contact</Label>
              <Input id="contact-sales" type="email" placeholder="sales@koodos.com" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}