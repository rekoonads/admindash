"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function CookiesPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Cookie Policy</h1>
        <p className="text-muted-foreground">Manage cookie policy and consent settings</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cookie Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="policy-content">Policy Content</Label>
              <Textarea 
                id="policy-content" 
                rows={10}
                placeholder="Enter the cookie policy content..."
              />
            </div>
            <Button>Save Policy</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookie Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="essential-cookies">Essential Cookies</Label>
              <Switch id="essential-cookies" defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="analytics-cookies">Analytics Cookies</Label>
              <Switch id="analytics-cookies" />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="marketing-cookies">Marketing Cookies</Label>
              <Switch id="marketing-cookies" />
            </div>
            <Button>Save Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}