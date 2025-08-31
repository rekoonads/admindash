interface ArticleData {
  title: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export async function generateArticle(keywords: string[], contentType: string, title?: string): Promise<ArticleData> {
  const query = keywords.join(' ');
  const timestamp = Date.now();
  
  console.log(`Generating article for: ${query}`);
  
  try {
    // Get web data
    const webData = await gatherWebData(query);
    console.log(`Web data gathered: ${webData.length} characters`);
    
    // Generate article with web data
    const article = {
      title: `${query} - Complete Guide ${timestamp}`,
      content: `# ${query}\n\nBased on current web research:\n\n${webData}\n\nThis comprehensive article covers ${query} with the latest information from web sources.`,
      excerpt: `Complete guide to ${query} with current web information`,
      metaTitle: `${query} - Complete Guide`,
      metaDescription: `Comprehensive ${query} guide with latest web information and insights`,
      keywords: keywords
    };
    
    console.log(`Article generated: ${article.title}`);
    return article;
    
  } catch (error) {
    console.error('Article generation failed:', error);
    
    // Simple fallback
    return {
      title: `${query} - Guide`,
      content: `# ${query}\n\nThis is a comprehensive guide about ${query}.`,
      excerpt: `Guide to ${query}`,
      metaTitle: `${query} - Guide`,
      metaDescription: `Complete ${query} guide`,
      keywords: keywords
    };
  }
}

async function gatherWebData(query: string): Promise<string> {
  try {
    const googleUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=5`;
    const response = await fetch(googleUrl);
    const data = await response.json();
    
    if (data.items) {
      return data.items.map((item: any, i: number) => 
        `${i+1}. ${item.title}\n${item.snippet}\nSource: ${item.displayLink}\n`
      ).join('\n');
    }
    
    return `No web data found for ${query}`;
  } catch (error) {
    console.error('Web search failed:', error);
    return `Web search unavailable for ${query}`;
  }
}