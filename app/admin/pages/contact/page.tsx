"use client"

import { LiquidEditor } from "@/components/liquid-editor"

export default function ContactPage() {
  const variables = {
    editorial_email: "editorial@koodos.com",
    phone: "+1 (555) 123-4567",
    office_address: "123 Gaming Street, Tech City, TC 12345",
    business_hours: "Monday - Friday, 9AM - 6PM EST",
    response_time: "24-48 hours"
  }

  const defaultTemplate = `# Contact Editorial Team

Get in touch with our editorial team for:

- Story tips and news submissions
- Interview requests
- Press inquiries
- Content partnerships

## Contact Information

**Email:** {{ editorial_email }}
**Phone:** {{ phone }}
**Address:** {{ office_address }}
**Business Hours:** {{ business_hours }}

## Response Time

We typically respond within {{ response_time }}.

{% if business_hours %}
For urgent matters during {{ business_hours }}, please call {{ phone }}.
{% endif %}`

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Contact Editorial Team</h1>
        <p className="text-muted-foreground">Manage contact information with Liquid templates</p>
      </div>

      <LiquidEditor 
        title="Contact Page Template"
        defaultContent={defaultTemplate}
        variables={variables}
      />
    </div>
  )
}