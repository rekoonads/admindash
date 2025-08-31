interface SeoPage {
  title: string
  current_meta: string
  content_preview: string
  headings: any
  word_count: number
}

interface MetaSuggestion {
  text: string
  keywords: string[]
  confidence: number
}

export async function generateMetaDescription(page: SeoPage): Promise<MetaSuggestion> {
  const keywords = extractKeywords(page)
  const prompt = buildPrompt(page, keywords)
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 100,
        temperature: 0.7
      })
    })

    const data = await response.json()
    const suggestion = data.choices[0]?.message?.content?.trim() || ''
    
    return {
      text: suggestion.substring(0, 160),
      keywords: keywords.slice(0, 3),
      confidence: calculateConfidence(suggestion, keywords)
    }
  } catch (error) {
    return generateFallbackMeta(page, keywords)
  }
}

function extractKeywords(page: SeoPage): string[] {
  const text = `${page.title} ${page.content_preview}`.toLowerCase()
  const words = text.match(/\b\w{4,}\b/g) || []
  
  const frequency: Record<string, number> = {}
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1
  })

  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word)
}

function buildPrompt(page: SeoPage, keywords: string[]): string {
  return `Write a compelling meta description (max 160 characters) for this webpage:

Title: ${page.title}
Content: ${page.content_preview}
Keywords: ${keywords.slice(0, 5).join(', ')}

Requirements:
- Exactly 120-160 characters
- Include primary keyword naturally
- Action-oriented and engaging
- Unique and descriptive

Meta description:`
}

function calculateConfidence(suggestion: string, keywords: string[]): number {
  let score = 0.5
  
  if (suggestion.length >= 120 && suggestion.length <= 160) score += 0.3
  if (keywords.some(kw => suggestion.toLowerCase().includes(kw))) score += 0.2
  
  return Math.min(score, 1.0)
}

function generateFallbackMeta(page: SeoPage, keywords: string[]): MetaSuggestion {
  const title = page.title || 'Page'
  const keyword = keywords[0] || 'content'
  
  const templates = [
    `Discover ${keyword} and more on ${title}. Expert insights and comprehensive coverage.`,
    `Learn about ${keyword} with our detailed guide. ${title} - your trusted source.`,
    `Explore ${keyword} topics and trends. ${title} provides expert analysis and updates.`
  ]
  
  const suggestion = templates[Math.floor(Math.random() * templates.length)]
  
  return {
    text: suggestion.substring(0, 160),
    keywords: keywords.slice(0, 3),
    confidence: 0.6
  }
}