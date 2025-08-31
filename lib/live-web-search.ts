export async function getLiveWebData(keywords: string[]): Promise<string> {
  const query = keywords.join(' ');
  
  try {
    // Real Google Custom Search API call
    const googleUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=10`;
    const googleResponse = await fetch(googleUrl);
    const googleData = await googleResponse.json();
    
    // Real Wikipedia API call
    const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const wikiResponse = await fetch(wikiUrl);
    const wikiData = await wikiResponse.json();
    
    let liveData = `LIVE WEB DATA FOR: ${query}\n\n`;
    
    // Process Google results
    if (googleData.items && googleData.items.length > 0) {
      liveData += "CURRENT GOOGLE SEARCH RESULTS:\n";
      googleData.items.slice(0, 8).forEach((item: any, index: number) => {
        liveData += `${index + 1}. TITLE: ${item.title}\n`;
        liveData += `   CONTENT: ${item.snippet}\n`;
        liveData += `   SOURCE: ${item.displayLink}\n`;
        liveData += `   URL: ${item.link}\n\n`;
      });
    }
    
    // Process Wikipedia data
    if (wikiData.extract) {
      liveData += "WIKIPEDIA INFORMATION:\n";
      liveData += `TITLE: ${wikiData.title}\n`;
      liveData += `SUMMARY: ${wikiData.extract}\n`;
      if (wikiData.content_urls?.desktop?.page) {
        liveData += `URL: ${wikiData.content_urls.desktop.page}\n`;
      }
      liveData += "\n";
    }
    
    // Add timestamp for freshness
    liveData += `DATA RETRIEVED: ${new Date().toISOString()}\n`;
    liveData += `SEARCH CONFIDENCE: ${googleData.items ? 'HIGH' : 'LOW'}\n`;
    
    console.log(`Live web data gathered: ${liveData.length} characters`);
    console.log(`Sample: ${liveData.substring(0, 300)}...`);
    
    return liveData;
    
  } catch (error) {
    console.error('Live web search failed:', error);
    
    // Fallback with error info
    return `LIVE WEB SEARCH FAILED FOR: ${query}
    
ERROR: ${error instanceof Error ? error.message : 'Unknown error'}
TIMESTAMP: ${new Date().toISOString()}
KEYWORDS: ${keywords.join(', ')}

Note: Unable to retrieve current web information. Please check API configuration.`;
  }
}