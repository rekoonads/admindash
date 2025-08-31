export class AIContentGenerator {
  async generateFromKeywords(keywords: string[], category: string = 'AI_GENERATED'): Promise<any> {
    const query = keywords.join(' ');
    const timestamp = Date.now();
    
    console.log(`[${timestamp}] AI Generation and Save for: ${query}`);
    
    try {
      // Step 1: Generate content with web data
      const response = await fetch('/api/articles/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          keywords,
          contentType: 'ARTICLE',
          title: query
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.article) {
        console.log(`[${timestamp}] Generated: ${data.article.title}`);
        
        // Step 2: Save to AI articles database (separate table)
        const saveResponse = await fetch('/api/ai-articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.article.title,
            content: data.article.content,
            excerpt: data.article.excerpt,
            metaTitle: data.article.metaTitle,
            metaDescription: data.article.metaDescription,
            keywords: data.article.keywords || keywords,
            webSources: data.article._webSources || 0,
            generationId: timestamp.toString()
          })
        });
        
        if (saveResponse.ok) {
          const savedData = await saveResponse.json();
          console.log(`[${timestamp}] AI article saved to separate database:`, savedData.article?.id);
        } else {
          console.error('Failed to save AI article:', await saveResponse.text());
        }
        
        return {
          title: data.article.title,
          content: data.article.content,
          metaDescription: data.article.metaDescription,
          tags: data.article.keywords || keywords,
          excerpt: data.article.excerpt,
          _webSources: data.article._webSources || 0,
          _saved: true,
          _timestamp: timestamp
        };
      }
      
      throw new Error('Generation failed');
      
    } catch (error) {
      console.error('Generation failed:', error);
      return {
        title: `${query} - Error`,
        content: `Generation failed: ${error}`,
        metaDescription: 'Error',
        tags: keywords,
        excerpt: 'Failed'
      };
    }
  }
}