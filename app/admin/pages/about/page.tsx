"use client"

import { LiquidEditor } from "@/components/liquid-editor"
import { SEOGenerator } from "@/components/seo-generator"

export default function AboutPage() {
  const variables = {
    site_name: "Koodos",
    company_founded: "2024",
    team_size: "15+",
    mission: "Your ultimate hub for gaming, anime, tech, and comics"
  }

  const defaultTemplate = `# About {{ site_name }}

{{ mission }}.

Founded in {{ company_founded }}, we are a team of {{ team_size }} passionate creators dedicated to bringing you the latest in:

- Gaming news and reviews
- Anime coverage and discussions  
- Technology insights
- Comic book analysis

## Our Mission

At {{ site_name }}, we believe in creating a community where enthusiasts can discover, discuss, and celebrate their favorite content.

{% if team_size > 10 %}
Our growing team of {{ team_size }} members works around the clock to deliver quality content.
{% endif %}`

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">About Koodos</h1>
        <p className="text-muted-foreground">Manage the About page content with Liquid templates</p>
      </div>

      <div className="grid gap-6">
        <LiquidEditor 
          title="About Page Template"
          defaultContent={defaultTemplate}
          variables={variables}
        />
        
        <SEOGenerator
          title="About Koodos"
          content={defaultTemplate}
        />
      </div>
    </div>
  )
}