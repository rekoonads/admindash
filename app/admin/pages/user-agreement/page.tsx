"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function UserAgreementPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">User Agreement</h1>
        <p className="text-muted-foreground">Manage terms of service and user agreement</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="last-updated">Last Updated</Label>
            <Input id="last-updated" type="date" />
          </div>
          <div>
            <Label htmlFor="terms-content">Agreement Content</Label>
            <Textarea 
              id="terms-content" 
              rows={15}
              placeholder="Enter the complete user agreement and terms of service..."
            />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}