import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cloudinary } from '@/lib/cloudinary';

async function generateMovieImages(movieTitle: string) {
  console.log('Generating image for:', movieTitle);
  
  const apiUrl = `https://aiplatform.googleapis.com/v1/projects/joinesl/locations/us-central1/publishers/google/models/imagen-4-ultra:predict?key=AIzaSyBD766qYkHkC4cFNu-al2jyNThXgptOrG0`;
  
  const requestBody = {
    instances: [{
      prompt: movieTitle
    }],
    parameters: {
      sampleCount: 1,
      aspectRatio: "16:9",
      safetyFilterLevel: "block_some",
      personGeneration: "dont_allow"
    }
  };
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(requestBody)
    });
    
    const data = await response.json();
    console.log('Imagen response status:', response.status);
    
    if (response.ok && data.predictions?.[0]?.bytesBase64Encoded) {
      const uploadResult = await cloudinary.uploader.upload(
        `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`,
        { folder: 'ai-generated' }
      );
      
      console.log('Image generated successfully:', uploadResult.secure_url);
      return {
        poster: uploadResult.secure_url,
        backdrop: uploadResult.secure_url
      };
    } else {
      console.log('Imagen failed:', data.error || 'No image data');
    }
  } catch (error) {
    console.error('ERROR in generateMovieImages:', error);
  }
  
  console.log('12. Using fallback images');
  const randomId = Date.now();
  const fallbackImages = {
    poster: `https://picsum.photos/400/600?random=${randomId}`,
    backdrop: `https://picsum.photos/800/450?random=${randomId + 1}`
  };
  console.log('13. Fallback images:', fallbackImages);
  console.log('=== IMAGEN 4 ULTRA DEBUG END ===\n');
  
  return fallbackImages;
  
  // Imagen 4 code commented out until proper authentication is set up
  /*
  try {
    const response = await fetch('https://aiplatform.googleapis.com/v1/projects/joinesl/locations/us-central1/publishers/google/models/imagen-4:predict', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GOOGLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        instances: [{
          prompt: `Professional movie poster for ${movieTitle}, cinematic style, high quality, dramatic lighting`
        }],
        parameters: {
          sampleCount: 1,
          aspectRatio: '9:16'
        }
      })
    });
    
    const data = await response.json();
    console.log('Imagen response:', data);
    
    if (data.predictions && data.predictions[0]) {
      const imageData = data.predictions[0].bytesBase64Encoded;
      const uploadResult = await cloudinary.uploader.upload(
        `data:image/png;base64,${imageData}`,
        { folder: 'movie-posters' }
      );
      
      return {
        poster: uploadResult.secure_url,
        backdrop: uploadResult.secure_url
      };
    }
  } catch (error) {
    console.error('Imagen 4 generation failed:', error);
  }
  */
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const keywords = body.keywords || [];
    const contentType = body.contentType || 'TITLE';
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        maxOutputTokens: contentType === 'ARTICLE' ? 4000 : 5000,
        temperature: contentType === 'TITLE' ? 0.7 : 0.6,
      }
    });
    
    const keywordText = keywords.join(', ');
    let prompt = '';
    
    switch(contentType) {
      case 'TITLE':
        const titleCategory = body.category || 'general';
        const titleKeywords = keywords.join(', ');
        
        const titlePrompts = {
          'game-reviews': `Create a compelling game review title about: ${titleKeywords}. Make it engaging and under 60 characters.`,
          'movie-reviews': `Create a creative movie review title using EXACTLY these keywords: ${titleKeywords}. Use these exact keywords in formats like: "${titleKeywords}: A Dark Masterpiece?", "${titleKeywords} Review: Epic Cinema", "Why ${titleKeywords} Succeeds", "${titleKeywords}: Year's Best Film?". Under 60 characters.`,
          'tv-reviews': `Create a compelling TV review title using EXACTLY these keywords: ${titleKeywords}. Format: "[Show Name] Review: [Catchy Subtitle]". Under 60 characters.`,
          'tech-reviews': `Create a compelling tech review title using EXACTLY these keywords: ${titleKeywords}. Format: "[Product Name] Review: [Key Feature]". Under 60 characters.`,
          'guides': `Create a creative guide title using EXACTLY these keywords: ${titleKeywords}. Use these exact keywords in formats like: "Master ${titleKeywords} Guide", "${titleKeywords}: Ultimate Tips", "Dominate ${titleKeywords} Like a Pro", "${titleKeywords} Secrets Revealed". Under 60 characters.`,
          'latest-news': `Create a creative breaking news title using EXACTLY these keywords: ${titleKeywords}. Use these exact keywords in formats like: "${titleKeywords}: Major Update", "${titleKeywords} Drops Bombshell", "${titleKeywords} Changes Everything", "Breaking: ${titleKeywords} News". Under 60 characters.`,
          'nintendo': `Create a Nintendo-focused title using EXACTLY these keywords: ${titleKeywords}. Include Nintendo context. Under 60 characters.`,
          'xbox': `Create an Xbox-focused title using EXACTLY these keywords: ${titleKeywords}. Include Xbox/Microsoft context. Under 60 characters.`,
          'playstation': `Create a PlayStation-focused title using EXACTLY these keywords: ${titleKeywords}. Include PS5/Sony context. Under 60 characters.`,
          'pc-gaming': `Create a PC gaming title using EXACTLY these keywords: ${titleKeywords}. Include PC-specific context. Under 60 characters.`,
          'mobile-gaming': `Create a mobile gaming title using EXACTLY these keywords: ${titleKeywords}. Include mobile context. Under 60 characters.`,
          'anime': `Create an anime title using EXACTLY these keywords: ${titleKeywords}. Include anime/manga context. Under 60 characters.`,
          'top-lists': `Create a top list title using EXACTLY these keywords: ${titleKeywords}. Format: "Top [Number] [Category]". Under 60 characters.`
        };
        
        prompt = titlePrompts[titleCategory] || `Create a compelling ${titleCategory || 'article'} title using these keywords: ${titleKeywords}. Make it engaging and under 60 characters.`;
        break;
      case 'DESCRIPTION':
        const descKeywords = keywords.join(' ');
        prompt = `Write a factual, precise description about: ${descKeywords}. Use neutral, plain language. Be concise (under 160 characters). Include only verifiable information relevant to the subject. Avoid subjective terms. Focus on what, when, where, who - basic facts only.`;
        break;
      case 'ARTICLE':
        // Get content type from request body or default
        const contentCategory = body.category || 'general';
        
        // Category-specific prompts
        const categoryPrompts = {
          'latest-news': `Write breaking news about: ${keywordText}. Target 800-1200 words. Include latest updates, industry impact, and expert analysis.`,
          
          'reviews': `Write a comprehensive review of: ${keywordText}. Target 1500-2000 words. Include pros, cons, rating out of 10, and buying recommendation.`,
          'game-reviews': `Write an in-depth game review of: ${keywordText}. Include gameplay, graphics, story, multiplayer, and final score out of 10.`,
          'movie-reviews': `Write a detailed movie review of: ${keywordText}. Include plot, performances, direction, cinematography, and rating out of 10.`,
          'tv-reviews': `Write a comprehensive TV show review of: ${keywordText}. Include episodes, characters, writing, and season rating.`,
          'comic-reviews': `Write a detailed comic review of: ${keywordText}. Include story, art, characters, and rating out of 10.`,
          'tech-reviews': `Write a thorough tech product review of: ${keywordText}. Include specs, performance, value, and recommendation.`,
          
          'guides': `Write a comprehensive guide about: ${keywordText}. Include step-by-step instructions, tips, tricks, and strategies.`,
          'nintendo': `Write detailed content about: ${keywordText}. Focus on Nintendo games, consoles, and ecosystem.`,
          'xbox': `Write comprehensive content about: ${keywordText}. Focus on Xbox games, Game Pass, and Microsoft gaming.`,
          'playstation': `Write detailed content about: ${keywordText}. Focus on PS5, exclusives, and Sony gaming ecosystem.`,
          'pc-gaming': `Write comprehensive content about: ${keywordText}. Include hardware, performance, mods, and PC-specific features.`,
          'mobile-gaming': `Write detailed content about: ${keywordText}. Focus on mobile games, monetization, and portable gaming.`,
          
          'videos': `Write a video script or analysis about: ${keywordText}. Include engaging hooks, key points, and call-to-action.`,
          'anime': `Write comprehensive content about: ${keywordText}. Include characters, plot, animation quality, and cultural impact.`,
          'cosplay': `Write detailed content about: ${keywordText}. Include costume details, crafting tips, and character analysis.`,
          
          'interviews': `Write an engaging interview piece about: ${keywordText}. Include insightful questions, personal stories, and industry insights.`,
          'spotlights': `Write a spotlight feature about: ${keywordText}. Highlight achievements, background, and future prospects.`,
          'top-lists': `Create a comprehensive top list about: ${keywordText}. Include rankings, explanations, and detailed analysis for each item.`,
          'opinions': `Write a thought-provoking opinion piece about: ${keywordText}. Include personal insights, industry analysis, and future predictions.`,
          
          'wiki': `Write comprehensive wiki-style content about: ${keywordText}. Include detailed information, history, and references.`,
          
          'tech': `Write detailed tech content about: ${keywordText}. Include technical specifications, innovations, and industry impact.`,
          'science-comics': `Write content about: ${keywordText}. Blend scientific accuracy with comic book storytelling.`
        };
        
        prompt = categoryPrompts[contentCategory] || `Write a comprehensive article about: ${keywordText}. MUST be 1500-2500 words minimum. Create engaging, informative content.`;
        
        // Ensure all prompts specify word count
        prompt += ` CRITICAL: Article must be MAXIMUM 2000 words. Stop writing at 2000 words. Be concise and focused. Do not write more than 2000 words under any circumstances.`;
        
        prompt += `\n\nFormat with proper structure: Use **bold headings** for all section titles, bullet points where appropriate, and well-organized paragraphs. Write naturally as a human expert would. Use conversational tone, personal insights, and real-world examples. Vary sentence length and structure. Include specific details, anecdotes, and practical information. Avoid repetitive phrases and AI-like patterns.`;
        break;
      case 'SEO':
        prompt = `Create ONLY a meta title (under 60 characters) and meta description (EXACTLY under 160 characters) for: ${keywordText}. Format:
Title: [Your title here]
Description: [Your description here]
Keep description under 160 characters. No explanations.`;
        break;
      case 'TAGS':
        prompt = `Generate ONLY 8 relevant tags for: ${keywordText}. Format as comma-separated list: tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8. No numbers, no explanations, just the tags.`;
        break;
      case 'SUGGESTIONS':
        prompt = `Generate 5 content ideas related to: ${keywordText}. Format as comma-separated list. Be creative and specific.`;
        break;
      case 'IMPROVE':
        prompt = `Analyze this content and suggest 3 specific improvements: ${keywordText}. Focus on clarity, engagement, and structure.`;
        break;
      case 'IMAGE':
        // For image generation, we'll use the generateMovieImages function
        const imageResult = await generateMovieImages(keywordText);
        return NextResponse.json({
          success: true,
          article: { imageUrl: imageResult.poster }
        });
        break;
    }
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const generated = response.text().trim();
    
    let processedResult = {};
    
    switch(contentType) {
      case 'TITLE':
        let cleanTitle = generated
          .replace(/["'*#@$%^&()\[\]{}|\\:;"'<>,.?/~`!]/g, '')
          .replace(/^\d+\.\s*/, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Fix common spelling errors
        cleanTitle = cleanTitle
          .replace(/neflix/gi, 'Netflix')
          .replace(/netflix/gi, 'Netflix')
          .replace(/NETFLIX/gi, 'Netflix')
          .substring(0, 60);
        
        processedResult = { title: cleanTitle };
        break;
      case 'DESCRIPTION':
        processedResult = { excerpt: generated.substring(0, 160) };
        break;
      case 'ARTICLE':
        console.log('=== ARTICLE GENERATION ===');
        
        // Generate images using all keywords for better relevance
        const allKeywords = keywordText.trim();
        console.log('Generating images for keywords:', allKeywords);
        
        console.log('=== GEMINI 2.5 PRO + IMAGEN 4 ULTRA ===');
        console.log('Generating 4 specific images for:', allKeywords);
        
        // Generate images using input keywords
        console.log('Using keywords for images:', allKeywords);
        
        const img1 = await generateMovieImages(allKeywords);
        const img2 = await generateMovieImages(allKeywords);
        const img3 = await generateMovieImages(allKeywords);
        const img4 = await generateMovieImages(allKeywords);
        
        const imageUrl1 = img1.poster;
        const imageUrl2 = img2.poster;
        const imageUrl3 = img3.poster;
        const imageUrl4 = img4.poster;
        
        console.log('Generated 4 different images:', {
          img1: imageUrl1 ? 'SUCCESS' : 'FALLBACK',
          img2: imageUrl2 ? 'SUCCESS' : 'FALLBACK', 
          img3: imageUrl3 ? 'SUCCESS' : 'FALLBACK',
          img4: imageUrl4 ? 'SUCCESS' : 'FALLBACK'
        });
        
        console.log('All 4 Imagen 4 Ultra images ready:', { imageUrl1, imageUrl2, imageUrl3, imageUrl4 });
        
        console.log('4 Images ready for article:', { imageUrl1, imageUrl2, imageUrl3, imageUrl4 });
        
        console.log('Processing article content with images...');
        
        // Force add images to article content
        let articleWithImages = generated;
        if (!generated.toLowerCase().includes('insert') && !generated.toLowerCase().includes('image')) {
          console.log('No image placeholders found, adding 4 images manually...');
          articleWithImages = generated
            .replace(/(H1: [^\n]+)/g, '$1\n\nINSERT IMAGE\n')
            .replace(/(H2: Introduction[\s\S]*?)(?=H2:|$)/g, '$1\n\nINSERT PHOTO\n')
            .replace(/(H2: Main Content[\s\S]*?)(?=H2:|$)/g, '$1\n\nINSERT DETAIL\n')
            .replace(/(H2: Analysis[\s\S]*?)(?=H2:|$)/g, '$1\n\nINSERT OVERVIEW\n');
        }
        
        let cleanArticle = articleWithImages
          .replace(/[#@$%^&*()\[\]{}|\\~`]/g, '')
          .replace(/H1: ([^\n]+)/g, '<h1><strong>$1</strong></h1>')
          .replace(/H2: ([^\n]+)/g, '<h2><strong>$1</strong></h2>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          .replace(/^([A-Z][^\n:]*:)$/gm, '<strong>$1</strong>')
          .replace(/^(\d+\. [^\n]+)$/gm, '<strong>$1</strong>')
          .replace(/INSERT IMAGE/gi, `<div class="article-image my-4"><img src="${imageUrl1}" alt="Article Image" class="w-full max-w-lg mx-auto rounded-lg shadow-md" loading="lazy" /></div>`)
          .replace(/INSERT PHOTO/gi, `<div class="article-image my-4"><img src="${imageUrl2}" alt="Article Photo" class="w-full max-w-lg mx-auto rounded-lg shadow-md" loading="lazy" /></div>`)
          .replace(/INSERT DETAIL/gi, `<div class="article-image my-4"><img src="${imageUrl3}" alt="Detail Image" class="w-full max-w-lg mx-auto rounded-lg shadow-md" loading="lazy" /></div>`)
          .replace(/INSERT OVERVIEW/gi, `<div class="article-image my-4"><img src="${imageUrl4}" alt="Overview Image" class="w-full max-w-lg mx-auto rounded-lg shadow-md" loading="lazy" /></div>`)
          .replace(/\[INSERT IMAGE\]/gi, `<div class="article-image my-4"><img src="${imageUrl1}" alt="Article Image" class="w-full max-w-lg mx-auto rounded-lg shadow-md" loading="lazy" /></div>`)
          .replace(/\[INSERT PHOTO\]/gi, `<div class="article-image my-4"><img src="${imageUrl2}" alt="Article Photo" class="w-full max-w-lg mx-auto rounded-lg shadow-md" loading="lazy" /></div>`)
          .replace(/\[insert movie poster image here\]/gi, `<div class="movie-image my-4"><img src="${imageUrl1}" alt="Movie Poster" class="w-full max-w-md mx-auto rounded-lg shadow-lg" loading="lazy" /></div>`)
          .replace(/\[insert relevant movie still here\]/gi, `<div class="movie-image my-4"><img src="${imageUrl2}" alt="Movie Still" class="w-full max-w-lg mx-auto rounded-lg shadow-md" loading="lazy" /></div>`)
          .replace(/\[insert cast photo here\]/gi, `<div class="movie-image my-4"><img src="${imageUrl1}" alt="Cast Photo" class="w-full max-w-lg mx-auto rounded-lg shadow-md" loading="lazy" /></div>`)
          .replace(/\[insert cinematic shot here\]/gi, `<div class="movie-image my-4"><img src="${imageUrl2}" alt="Cinematic Shot" class="w-full max-w-lg mx-auto rounded-lg shadow-md" loading="lazy" /></div>`)
          .replace(/\[Insert [^\]]+\]/gi, '<div class="movie-image"><img src="https://picsum.photos/seed/picsum/400/600" alt="Movie Image" class="w-full max-w-lg mx-auto rounded-lg shadow-md" /></div>')
          .replace(/^([^<\n]+)$/gm, '<p>$1</p>')
          .replace(/<p><h/g, '<h')
          .replace(/<\/h([12])><\/p>/g, '</h$1>')
          .replace(/<p><div/g, '<div')
          .replace(/<\/div><\/p>/g, '</div>')
          .replace(/Rating: (\d+\/10)/g, '<strong>Rating: $1</strong>')
          .replace(/Title: ([^\n<]+)/g, '<strong>Title:</strong> $1')
          .replace(/Director: ([^\n<]+)/g, '<strong>Director:</strong> $1')
          .replace(/Stars: ([^\n<]+)/g, '<strong>Stars:</strong> $1')
          .replace(/Genre: ([^\n<]+)/g, '<strong>Genre:</strong> $1')
          .replace(/Year: ([^\n<]+)/g, '<strong>Year:</strong> $1')
          .replace(/Runtime: ([^\n<]+)/g, '<strong>Runtime:</strong> $1')
          .replace(/<p><\/p>/g, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        processedResult = {
          content: cleanArticle,
          title: `${keywordText} - Expert Review`,
          excerpt: generated.substring(0, 200).replace(/[^a-zA-Z0-9\s.,]/g, '').trim() + '...'
        };
        break;
      case 'SEO':
        const lines = generated.split('\n').filter(line => line.trim());
        let seoTitle = lines.find(line => line.toLowerCase().includes('title:'))?.replace(/title:/gi, '').trim() || lines[0] || keywordText;
        let seoDesc = lines.find(line => line.toLowerCase().includes('description:'))?.replace(/description:/gi, '').trim() || lines[1] || generated.substring(0, 160);
        
        // Clean special characters
        seoTitle = seoTitle.replace(/["'*#@$%^&()\[\]{}|\\:;"'<>,.?/~`!]/g, '').trim();
        seoDesc = seoDesc.replace(/["'*#@$%^&()\[\]{}|\\:;"'<>?/~`!]/g, '').trim();
        
        processedResult = {
          title: seoTitle.substring(0, 60),
          excerpt: seoDesc.substring(0, 160)
        };
        break;
      case 'TAGS':
        const tags = generated.split(/[,\n]/).map(t => t.trim()).filter(t => t.length > 0);
        processedResult = { keywords: tags };
        break;
      case 'SUGGESTIONS':
        const suggestions = generated.split(/[,\n]/).map(s => s.trim()).filter(s => s.length > 0);
        processedResult = { suggestions: suggestions };
        break;
      case 'IMPROVE':
        processedResult = { improvements: generated.trim() };
        break;
    }
    
    return NextResponse.json({
      success: true,
      article: processedResult
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}