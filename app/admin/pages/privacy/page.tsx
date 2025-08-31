"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PrivacyPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-muted-foreground">Manage privacy policy and data handling</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="effective-date">Effective Date</Label>
            <Input id="effective-date" type="date" />
          </div>
          <div>
            <Label htmlFor="privacy-content">Policy Content</Label>
            <Textarea 
              id="privacy-content" 
              rows={15}
              placeholder="Enter the complete privacy policy..."
            />
          </div>
          <div>
            <Label htmlFor="contact-privacy">Privacy Contact</Label>
            <Input id="contact-privacy" type="email" placeholder="privacy@koodos.com" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}