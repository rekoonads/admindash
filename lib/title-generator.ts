interface TitleTemplate {
  pattern: string;
  category: string[];
}

const titleTemplates: TitleTemplate[] = [
  { pattern: "{keyword1}: Complete {type} and Analysis", category: ["review", "guide"] },
  { pattern: "{keyword1} vs {keyword2}: Ultimate Comparison", category: ["review", "comparison"] },
  { pattern: "Best {keyword1} {type} in 2024", category: ["guide", "list"] },
  { pattern: "{keyword1}: Everything You Need to Know", category: ["guide", "news"] },
  { pattern: "Top 10 {keyword1} {keyword2} Worth Trying", category: ["list", "guide"] },
  { pattern: "{keyword1} {keyword2}: Expert Review and Rating", category: ["review"] },
  { pattern: "How to Master {keyword1} in {keyword2}", category: ["guide", "tutorial"] },
  { pattern: "{keyword1} Breaking News: {keyword2} Updates", category: ["news"] },
  { pattern: "Ultimate {keyword1} Guide for {keyword2} Fans", category: ["guide"] },
  { pattern: "{keyword1} {keyword2}: Pros, Cons, and Verdict", category: ["review"] }
];

export function generateTitle(keywords: string[], contentType: string = "guide"): string {
  if (keywords.length === 0) return "";
  
  // Filter templates by content type
  const relevantTemplates = titleTemplates.filter(template => 
    template.category.includes(contentType.toLowerCase())
  );
  
  // Fallback to all templates if no relevant ones found
  const templates = relevantTemplates.length > 0 ? relevantTemplates : titleTemplates;
  
  // Select random template
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Replace placeholders
  let title = template.pattern;
  title = title.replace("{keyword1}", keywords[0] || "");
  title = title.replace("{keyword2}", keywords[1] || keywords[0] || "");
  title = title.replace("{type}", contentType);
  
  // Capitalize first letter
  return title.charAt(0).toUpperCase() + title.slice(1);
}

export function generateMultipleTitles(keywords: string[], contentType: string = "guide", count: number = 5): string[] {
  const titles: string[] = [];
  const usedTemplates = new Set<string>();
  
  for (let i = 0; i < count && i < titleTemplates.length; i++) {
    let template;
    let attempts = 0;
    
    // Try to get a unique template
    do {
      const relevantTemplates = titleTemplates.filter(t => 
        t.category.includes(contentType.toLowerCase()) && !usedTemplates.has(t.pattern)
      );
      
      const availableTemplates = relevantTemplates.length > 0 ? relevantTemplates : 
        titleTemplates.filter(t => !usedTemplates.has(t.pattern));
      
      if (availableTemplates.length === 0) break;
      
      template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
      attempts++;
    } while (usedTemplates.has(template.pattern) && attempts < 10);
    
    if (template) {
      usedTemplates.add(template.pattern);
      
      let title = template.pattern;
      title = title.replace("{keyword1}", keywords[0] || "");
      title = title.replace("{keyword2}", keywords[1] || keywords[0] || "");
      title = title.replace("{type}", contentType);
      
      titles.push(title.charAt(0).toUpperCase() + title.slice(1));
    }
  }
  
  return titles;
}