// Integration with website backend for automatic meta updates

export async function updateWebsiteMeta(pageUrl: string, metaDescription: string) {
  try {
    // For static sites (Next.js)
    await updateStaticMeta(pageUrl, metaDescription)
    
    // For CMS integration
    await updateCmsMeta(pageUrl, metaDescription)
    
    // For database-driven sites
    await updateDatabaseMeta(pageUrl, metaDescription)
    
    return { success: true }
  } catch (error) {
    console.error('Meta update failed:', error)
    return { success: false, error: error.message }
  }
}

async function updateStaticMeta(pageUrl: string, metaDescription: string) {
  // Update Next.js metadata
  const response = await fetch('/api/meta/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: pageUrl, meta: metaDescription })
  })
  
  if (!response.ok) throw new Error('Static meta update failed')
}

async function updateCmsMeta(pageUrl: string, metaDescription: string) {
  // WordPress REST API example
  const wpResponse = await fetch(`${process.env.WP_API_URL}/wp/v2/pages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.WP_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      slug: extractSlugFromUrl(pageUrl),
      meta: { description: metaDescription }
    })
  })
  
  if (!wpResponse.ok) throw new Error('CMS meta update failed')
}

async function updateDatabaseMeta(pageUrl: string, metaDescription: string) {
  // Update in local database
  await prisma.article.updateMany({
    where: { 
      OR: [
        { slug: extractSlugFromUrl(pageUrl) },
        { url: pageUrl }
      ]
    },
    data: { meta_description: metaDescription }
  })
}

function extractSlugFromUrl(url: string): string {
  return url.split('/').pop() || ''
}

// Scheduled automation
export async function scheduleWeeklyCrawl() {
  // Using node-cron or similar
  const cron = require('node-cron')
  
  cron.schedule('0 2 * * 1', async () => {
    console.log('Starting weekly SEO crawl...')
    
    try {
      const response = await fetch('/api/seo/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          baseUrl: process.env.WEBSITE_URL,
          maxPages: 200 
        })
      })
      
      console.log('Weekly crawl completed:', await response.json())
    } catch (error) {
      console.error('Weekly crawl failed:', error)
    }
  })
}