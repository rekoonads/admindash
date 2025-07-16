"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Settings, Globe, Palette, Code } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your site configuration and preferences</p>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>Configure basic site information and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site Name</Label>
            <Input id="site-name" defaultValue="koodos.in" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="site-description">Site Description</Label>
            <Textarea
              id="site-description"
              defaultValue="Your ultimate hub for gaming, anime, tech, and comics."
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
            <Switch id="maintenance-mode" />
          </div>
          <Button>Save General Settings</Button>
        </CardContent>
      </Card>

      {/* SEO Metadata Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            SEO Metadata
          </CardTitle>
          <CardDescription>Optimize your site for search engines.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meta-title">Default Meta Title</Label>
            <Input id="meta-title" placeholder="e.g., Koodos.in - Gaming, Anime, Tech & Comics" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meta-description">Default Meta Description</Label>
            <Textarea
              id="meta-description"
              placeholder="A comprehensive platform for all your entertainment needs."
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input id="keywords" placeholder="gaming, anime, tech, comics, reviews, news" />
          </div>
          <Button>Save SEO Settings</Button>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Settings
          </CardTitle>
          <CardDescription>Customize your site's appearance.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primary-color">Primary Color</Label>
            <Input id="primary-color" type="color" defaultValue="#007bff" className="w-24 h-10 p-1" />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="dark-mode-toggle">Enable Dark Mode Toggle</Label>
            <Switch id="dark-mode-toggle" defaultChecked />
          </div>
          <Button>Save Theme Settings</Button>
        </CardContent>
      </Card>

      {/* Custom Scripts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Custom Scripts
          </CardTitle>
          <CardDescription>Add custom JavaScript or CSS to your site (e.g., analytics, tracking).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="header-scripts">Header Scripts ({"<head>"})</Label>
            <Textarea id="header-scripts" placeholder="<!-- Google Analytics -->" rows={5} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body-scripts">Body Scripts ({"<body>"})</Label>
            <Textarea id="body-scripts" placeholder="<!-- Live Chat Widget -->" rows={5} />
          </div>
          <Button>Save Custom Scripts</Button>
        </CardContent>
      </Card>
    </div>
  )
}
