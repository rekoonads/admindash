"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  ArrowLeft,
  Save,
  Send,
  Eye,
  CalendarIcon,
  Clock,
  ImageIcon,
  Search,
  Sparkles,
  Settings,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createArticle, updatePost } from "@/lib/actions";
import type { Post } from "@/lib/prisma";
import Image from "next/image";
import { TiptapEditor } from "./tiptap-editor";
import { CloudinaryImageUpload } from "./cloudinary-image-upload";
import { useUser } from "@clerk/nextjs";

interface ContentEditorProps {
  type: string;
  initialTitle?: string;
  initialContent?: string;
  initialExcerpt?: string;
  initialCategory?: string;
  initialStatus?: "DRAFT" | "PUBLISHED" | "HIDDEN";
  editingPost?: Post | null;
  onSave: () => void;
  onPublish: () => void;
}

export function ContentEditor({
  type,
  initialTitle = "",
  initialContent = "",
  initialExcerpt = "",
  initialCategory = "reviews",
  initialStatus = "DRAFT",
  editingPost,
  onSave,
  onPublish,
}: ContentEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [excerpt, setExcerpt] = useState(initialExcerpt);

  
  const getCategoryFromType = (contentType: string) => {
    console.log('🔍 Mapping type to category:', contentType);
    console.log('🔍 Content type details:', { type: contentType, length: contentType.length, chars: contentType.split('') });
    // Reviews (specific first) - handle both singular and plural forms
    if (contentType === 'Game Reviews' || contentType === 'Game Review') return 'game-reviews';
    if (contentType === 'Movie Reviews' || contentType === 'Movie Review') return 'movie-reviews';
    if (contentType === 'TV Reviews' || contentType === 'TV Review') return 'tv-reviews';
    if (contentType === 'Tech Reviews' || contentType === 'Tech Review') return 'tech-reviews';
    if (contentType === 'Comic Reviews' || contentType === 'Comic Review') return 'comic-reviews';
    if (contentType === 'All Reviews' || contentType === 'Reviews') return 'reviews';
    if (contentType.includes('Review')) return 'reviews';
    // Gaming (specific first)
    if (contentType.includes('Game Guide')) return 'guides';
    if (contentType.includes('PC Gaming')) return 'pc-gaming';
    if (contentType.includes('Mobile Gaming')) return 'mobile-gaming';
    if (contentType.includes('Nintendo')) return 'nintendo';
    if (contentType.includes('Xbox')) return 'xbox';
    if (contentType.includes('PlayStation')) return 'playstation';
    // Gaming
    if (contentType === 'Mobile Gaming Article') return 'mobile-gaming';
    // Entertainment  
    if (contentType === 'Video') return 'videos';
    if (contentType.includes('Anime')) return 'anime';
    if (contentType.includes('Cosplay')) return 'cosplay';
    if (contentType.includes('Entertainment')) return 'entertainment';
    // Editorial
    if (contentType.includes('Interview')) return 'interviews';
    if (contentType.includes('Spotlight')) return 'spotlights';
    if (contentType === 'Top List') return 'top-lists';
    if (contentType.includes('Opinion')) return 'opinions';
    if (contentType.includes('Editorial')) return 'editorial';
    // Guides & Wiki
    if (contentType.includes('Guides & Wiki')) return 'guides-wiki';
    if (contentType === 'Guide') return 'guides';
    if (contentType.includes('Wiki')) return 'wiki';
    // Tech & Science
    if (contentType.includes('Tech & Science')) return 'tech-science';
    if (contentType.includes('Science & Comics')) return 'science-comics';
    if (contentType.includes('Science')) return 'science-comics';
    if (contentType === 'Tech') return 'tech';
    // News and Latest Updates
    if (contentType.includes('Latest Updates')) return 'latest-updates';
    if (contentType.includes('News')) return 'latest-updates';
    console.log('⚠️ No match found, defaulting to latest-updates for:', contentType);
    console.log('🔍 Available checks that failed:');
    console.log('- Game Review:', contentType.includes('Game Review'));
    console.log('- Movie Review:', contentType.includes('Movie Review'));
    console.log('- All Reviews:', contentType.includes('All Reviews'));
    console.log('- Review:', contentType.includes('Review'));
    return 'latest-updates';
  };
  
  const [category, setCategory] = useState(initialCategory);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([initialCategory]);
  const [status, setStatus] = useState<
    "DRAFT" | "PUBLISHED" | "HIDDEN" | "SCHEDULED"
  >(initialStatus as any);
  const [tags, setTags] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [author, setAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [titleLoading, setTitleLoading] = useState(false);
  const [descLoading, setDescLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [seoLoading, setSeoLoading] = useState(false);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [purchaseLink, setPurchaseLink] = useState("");
  const [price, setPrice] = useState("");
  const [availableCategories, setAvailableCategories] = useState<Array<{slug: string, name: string}>>([]);
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);

  const { user } = useUser();
  
  useEffect(() => {
    // Set author from user context
    if (user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      setAuthor(fullName || user.username || user.emailAddresses?.[0]?.emailAddress || 'Admin User');
    } else {
      setAuthor('Admin User'); // Fallback when no user
    }
  }, [user]);

  // Fetch categories from API
  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setAvailableCategories(data))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);
  
  // Sync primary category with selected categories
  useEffect(() => {
    setCategory(initialCategory);
    setSelectedCategories([initialCategory]);
  }, [initialCategory]);
  
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setExcerpt(editingPost.excerpt || "");
      setCategory(editingPost.category?.slug || editingPost.category_id || "news");
      // Handle category data properly
      const currentCategory = editingPost.category?.slug || editingPost.category_id || "news";
      setSelectedCategories([currentCategory]);
      setStatus(editingPost.status as any);
      setTags(""); // Tags not in current schema
      setFeaturedImage(editingPost.featured_image || "");
      setVideoUrl(""); // Not in schema
      setThumbnail(""); // Not in schema
      // Handle fields that may not exist in Post type
      setMetaTitle((editingPost as any).meta_title || "");
      setMetaDescription((editingPost as any).meta_description || "");
      setMetaKeywords((editingPost as any).meta_keywords || "");
      setIsFeatured((editingPost as any).is_featured || false);
      setPurchaseLink((editingPost as any).purchase_link || "");
      setPrice((editingPost as any).price || "");
    }
  }, [editingPost]);

  const handleSave = async (saveStatus: "DRAFT" | "PUBLISHED" | "HIDDEN") => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }



    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content);
      formData.append("excerpt", excerpt.trim());
      
      // Map content type to article type
      let articleType = "NEWS";
      if (type.includes("Review")) {
        articleType = "GAME_REVIEW";
      } else if (type.includes("Guide")) {
        articleType = "GUIDE";
      } else if (type.includes("Video")) {
        articleType = "VIDEO";
      } else if (type.includes("Interview")) {
        articleType = "INTERVIEW";
      }
      
      console.log('🎯 Using category:', initialCategory);
      console.log('🎯 Category state:', category);
      console.log('🎯 Selected categories:', selectedCategories);
      formData.append("categoryId", initialCategory);
      console.log("📤 Sending to server:", initialCategory);
      formData.append("categories", JSON.stringify(selectedCategories));
      console.log("Selected categories:", selectedCategories);
      formData.append("type", articleType);
      formData.append("status", status === "SCHEDULED" ? "SCHEDULED" : saveStatus);
      formData.append("tags", tags);
      if (featuredImage) formData.append("featuredImage", featuredImage);
      if (videoUrl) formData.append("videoUrl", videoUrl);
      if (thumbnail) formData.append("thumbnail", thumbnail);
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("metaKeywords", metaKeywords);
      formData.append("isFeatured", isFeatured.toString());
      formData.append("purchaseLink", purchaseLink);
      formData.append("price", price);
      if (status === "SCHEDULED" && scheduleDate) {
        const scheduledDateTime = new Date(scheduleDate);
        const [hours, minutes] = scheduleTime.split(':');
        scheduledDateTime.setHours(parseInt(hours), parseInt(minutes));
        formData.append("scheduledDate", scheduledDateTime.toISOString());
      }
      
      // Set image field for video content
      if (videoUrl) {
        formData.append("image", videoUrl);
      } else if (featuredImage) {
        formData.append("image", featuredImage);
      }

      let article;
      if (editingPost) {
        article = await updatePost(editingPost.id, formData);
      } else {
        article = await createArticle(formData);
      }

      if (saveStatus === "PUBLISHED") {
        onPublish();
      } else {
        onSave();
      }
      
      return article;
    } catch (error) {
      console.error("Error saving post:", error);
      alert(
        `Error saving post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Use dynamic categories from API, fallback to static list
  const categories = availableCategories.length > 0 
    ? availableCategories.map(cat => cat.slug)
    : [
        "latest-news",
        "reviews",
        "game-guides",
        "tech-news",
        "video-content",
        "anime",
        "comics",
        "esports",
        "pc-gaming",
        "playstation-5",
        "xbox",
        "nintendo-switch",
        "mobile-gaming",
        "science",
      ];

  if (showPreview) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setShowPreview(false)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Editor
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleSave("DRAFT")}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={() => handleSave("PUBLISHED")}
              disabled={isLoading}
            >
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <article className="prose prose-gray max-w-none dark:prose-invert">
              {featuredImage && (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-6">
                  <Image
                    src={featuredImage || "/placeholder.svg"}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <h1>{title}</h1>
              {excerpt && (
                <p className="text-lg text-muted-foreground">{excerpt}</p>
              )}
              <div
                className="prose prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-a:text-primary hover:prose-a:underline prose-ul:list-disc prose-ol:list-decimal prose-li:ml-4 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-code:bg-muted prose-code:px-1 prose-code:rounded"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </article>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onSave}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {editingPost ? `Edit ${type}` : `Create ${type}`}
            </h1>
            <p className="text-muted-foreground">
              Write and publish your {type.toLowerCase()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              if (!title || !content) return;
              // Save as draft first, then preview
              try {
                const article = await handleSave("DRAFT");
                // Use the URL returned from the backend
                const previewUrl = article?.url;
                if (previewUrl) {
                  console.log('Preview URL:', previewUrl);
                  window.open(previewUrl, '_blank');
                } else {
                  console.error('No URL returned from backend');
                  alert('Error: Could not generate preview URL');
                }
              } catch (error) {
                console.error('Error saving for preview:', error);
                alert('Error saving article for preview');
              }
            }}
            disabled={!title || !content || isLoading}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Preview on Website"}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSave("DRAFT")}
            disabled={isLoading || !title || !content}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            onClick={() => handleSave("PUBLISHED")}
            disabled={isLoading || !title || !content}
          >
            <Send className="h-4 w-4 mr-2" />
            {isLoading
              ? "Publishing..."
              : status === "SCHEDULED"
                ? "Schedule"
                : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3 space-y-6">

          <Card className="border border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Article Content</CardTitle>
              <p className="text-sm text-gray-600">Create and edit your article content</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">Title *</Label>
                  <div className="flex items-center gap-2">
                    {title && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                    <span className="text-xs text-gray-500">{title.length} characters</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-orange-600" />
                    <span className="text-xs font-medium text-orange-700">AI Title Generator</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="titleTopic"
                      placeholder="Enter 3-4 keywords (e.g., gaming, review, zelda, nintendo)..."
                      className="flex-1 text-xs bg-white border-orange-200 focus:border-orange-400"
                    />
                    <button
                      type="button"
                      form=""
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const topicInput = document.getElementById('titleTopic') as HTMLInputElement;
                        const topic = topicInput?.value?.trim();
                        if (!topic) {
                          alert('Please enter keywords first');
                          return;
                        }
                        
                        const keywords = topic.split(',').map(k => k.trim()).filter(k => k.length > 0);
                        if (keywords.length < 2) {
                          alert('Please enter at least 2-3 keywords separated by commas');
                          return;
                        }
                        
                        setTitleLoading(true);
                        try {
                          const response = await fetch('/api/articles/generate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              keywords: keywords,
                              contentType: 'TITLE',
                              category: initialCategory
                            })
                          });
                          const data = await response.json();
                          if (data.success && data.article) {
                            setTitle(data.article.title);
                            if (data.article.suggestions) {
                              setTitleSuggestions(data.article.suggestions);
                            }
                          }
                        } catch (error) {
                          console.error('Title generation failed:', error);
                        } finally {
                          setTitleLoading(false);
                        }
                      }}
                      disabled={titleLoading}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 flex items-center gap-2"
                    >
                      {titleLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate
                        </>
                      )}
                    </button>
                  </div>
                  
                  {titleSuggestions.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="text-xs font-medium text-orange-700">AI Suggestions (click to use):</div>
                      <div className="space-y-1">
                        {titleSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setTitle(suggestion)}
                            className="w-full text-left px-2 py-1 text-xs bg-white border border-orange-200 rounded hover:bg-orange-50 hover:border-orange-300 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <Input
                  id="title"
                  placeholder={`Enter ${type.toLowerCase()} title`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="text-lg font-medium border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="excerpt" className="text-sm font-medium text-gray-700">Description</Label>
                  <div className="flex items-center gap-2">
                    {excerpt && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                    <span className="text-xs text-gray-500">{excerpt?.length || 0} characters</span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-3 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">AI Description Generator</span>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      id="descTopic"
                      placeholder="Enter topic for description generation..."
                      className="flex-1 text-xs bg-white border-blue-200 focus:border-blue-400"
                    />
                    <button
                      type="button"
                      form=""
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const topicInput = document.getElementById('descTopic') as HTMLInputElement;
                        const topic = topicInput?.value?.trim() || title;
                        if (!topic) {
                          alert('Please enter a topic or add title first');
                          return;
                        }
                        
                        setDescLoading(true);
                        try {
                          const response = await fetch('/api/articles/generate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              keywords: topic.split(',').map(k => k.trim()).filter(k => k.length > 0),
                              contentType: 'DESCRIPTION'
                            })
                          });
                          const data = await response.json();
                          if (data.success && data.article) {
                            setExcerpt(data.article.excerpt);
                          }
                        } catch (error) {
                          console.error('Description generation failed:', error);
                        } finally {
                          setDescLoading(false);
                        }
                      }}
                      disabled={descLoading}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded"
                    >
                      {descLoading ? 'Generating...' : 'Generate'}
                    </button>
                  </div>
                </div>
                
                <Input
                  id="excerpt"
                  placeholder="Brief description of the article..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>



              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content" className="text-sm font-medium text-gray-700">Content *</Label>
                  <div className="flex items-center gap-2">
                    {content && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">{content.replace(/<[^>]*>/g, '').split(' ').filter(word => word.length > 0).length}</span> words
                      <span className="mx-1">•</span>
                      <span className="font-medium">{content.length}</span> characters
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">AI Content Generator</h3>
                      <p className="text-xs text-gray-600">Powered by Gemini 2.5 Pro</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="aiTopic" className="text-xs font-medium text-gray-700 mb-1 block">What would you like to write about?</Label>
                      <Input
                        id="aiTopic"
                        placeholder="e.g., The Batman 2022 movie review, Gaming tips for beginners..."
                        className="bg-white/80 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400 text-sm"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          
                          const topicInput = document.getElementById('aiTopic') as HTMLInputElement;
                          const topic = topicInput?.value?.trim();
                          if (!topic) {
                            alert('Please enter a topic first');
                            return;
                          }
                          
                          setContentLoading(true);
                          try {
                            const response = await fetch('/api/articles/generate', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                                keywords: [topic],
                                contentType: 'ARTICLE',
                                category: initialCategory
                              })
                            });
                            
                            const data = await response.json();
                            
                            if (data.success && data.article) {
                              setContent(data.article.content);
                              if (data.article.excerpt) {
                                setExcerpt(data.article.excerpt);
                              }
                            } else {
                              alert('AI generation failed: ' + (data.error || 'Unknown error'));
                            }
                          } catch (error) {
                            console.error('Content generation failed:', error);
                            alert('AI generation failed: ' + error.message);
                          } finally {
                            setContentLoading(false);
                          }
                        }}
                        disabled={contentLoading}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0 shadow-sm rounded text-sm font-medium"
                      >
                        <Sparkles className="h-3 w-3 mr-1 inline" />
                        {contentLoading ? 'Generating...' : 'Generate Content'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          const topicInput = document.getElementById('aiTopic') as HTMLInputElement;
                          if (topicInput) topicInput.value = title || '';
                        }}
                        className="px-3 py-1.5 text-xs border border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded font-medium"
                      >
                        Use Title
                      </button>
                    </div>
                    
                    <div className="text-xs text-gray-500 bg-white/60 rounded-lg p-2">
                      💡 <strong>Tip:</strong> Be specific about your topic for better results. Include the type of content you want (review, guide, analysis, etc.)
                    </div>
                  </div>
                </div>
                

                <div className="border border-gray-300 rounded-lg overflow-hidden relative">
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-gray-500 border">
                      {content.replace(/<[^>]*>/g, '').split(' ').filter(word => word.length > 0).length} words
                    </div>
                  </div>
                  <TiptapEditor
                    content={content}
                    onChange={setContent}
                    placeholder={`Write your ${type.toLowerCase()} content here...`}
                    className="min-h-[500px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-gray-900">Media & Assets</CardTitle>
                  <p className="text-xs text-gray-500">Upload images and videos</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <CloudinaryImageUpload
                  value={featuredImage}
                  onChange={setFeaturedImage}
                  onRemove={() => setFeaturedImage("")}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  name="videoUrl"
                  placeholder="YouTube/Vimeo URL"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Video Thumbnail</Label>
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  placeholder="Thumbnail image URL"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Send className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-gray-900">Publishing</CardTitle>
                  <p className="text-xs text-gray-500">Control visibility and timing</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant={status === "PUBLISHED" ? "default" : "secondary"}
                >
                  {status.toLowerCase()}
                </Badge>
              </div>
              <Select
                value={status}
                onValueChange={(
                  value: "DRAFT" | "PUBLISHED" | "HIDDEN" | "SCHEDULED"
                ) => setStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="HIDDEN">Hidden</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                </SelectContent>
              </Select>

              {status === "SCHEDULED" && (
                <div className="space-y-3 mt-4">
                  <div className="space-y-2">
                    <Label>Schedule Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !scheduleDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduleDate
                            ? format(scheduleDate, "PPP")
                            : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={scheduleDate}
                          onSelect={setScheduleDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scheduleTime">Schedule Time</Label>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="scheduleTime"
                        name="scheduleTime"
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {scheduleDate && (
                    <div className="text-sm text-muted-foreground p-2 bg-muted rounded">
                      Will be published on {format(scheduleDate, "PPP")} at{" "}
                      {scheduleTime}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Settings className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-gray-900">Settings</CardTitle>
                  <p className="text-xs text-gray-500">Configure article options</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="gaming, review, nintendo, zelda..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Separate tags with commas</p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="homepage"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="homepage">Show on Homepage</Label>
              </div>
              {type.includes("Review") && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseLink">Purchase Link</Label>
                    <Input
                      id="purchaseLink"
                      name="purchaseLink"
                      placeholder="https://store.steampowered.com/..."
                      value={purchaseLink}
                      onChange={(e) => setPurchaseLink(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      placeholder="$59.99"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Search className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-gray-900">SEO Optimization</CardTitle>
                  <p className="text-xs text-gray-500">Powered by Gemini 2.5 Pro</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">AI SEO Generator</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-auto"></div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Input
                      id="seoTopic"
                      placeholder="Enter topic for SEO optimization..."
                      className="bg-white border-purple-200 focus:border-purple-400 text-sm"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const topicInput = document.getElementById('seoTopic') as HTMLInputElement;
                        const topic = topicInput?.value?.trim() || title;
                        if (!topic) {
                          alert('Please enter a topic or add title first');
                          return;
                        }
                        
                        setSeoLoading(true);
                        try {
                          const response = await fetch('/api/articles/generate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              keywords: [topic],
                              contentType: 'SEO'
                            })
                          });
                          const data = await response.json();
                          if (data.success && data.article) {
                            setMetaTitle(data.article.title);
                            setMetaDescription(data.article.excerpt);
                          }
                        } catch (error) {
                          console.error('SEO generation failed:', error);
                        } finally {
                          setSeoLoading(false);
                        }
                      }}
                      disabled={seoLoading}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      {seoLoading ? 'Generating SEO...' : 'Generate Meta Title & Description'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        const topicInput = document.getElementById('seoTopic') as HTMLInputElement;
                        const topic = topicInput?.value?.trim() || title;
                        if (!topic) {
                          alert('Please enter a topic or add title first');
                          return;
                        }
                        
                        setTagsLoading(true);
                        try {
                          const response = await fetch('/api/articles/generate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                              keywords: [topic],
                              contentType: 'TAGS'
                            })
                          });
                          const data = await response.json();
                          if (data.success && data.article) {
                            setTags(data.article.keywords.join(', '));
                            setMetaKeywords(data.article.keywords.join(', '));
                          }
                        } catch (error) {
                          console.error('Tags generation failed:', error);
                        } finally {
                          setTagsLoading(false);
                        }
                      }}
                      disabled={tagsLoading}
                      className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {tagsLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Generating Tags...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Generate SEO Tags & Keywords
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-white/50">
                    <div className="flex items-start gap-2">
                      <div className="text-sm">💡</div>
                      <div className="text-xs text-gray-600">
                        <span className="font-medium">Pro Tip:</span> Be specific with your topic for better SEO results. Include keywords like "review", "guide", or "analysis".
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 bg-white/60 rounded-lg p-2">
                    💡 <strong>Tip:</strong> Enter a specific topic to generate optimized SEO elements
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="metaTitle" className="text-sm font-medium text-gray-700">Meta Title</Label>
                    <div className="flex items-center gap-2">
                      {metaTitle && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                      <span className="text-xs text-gray-500">{metaTitle.length}/60</span>
                    </div>
                  </div>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    placeholder="SEO title for search engines"
                    value={metaTitle}
                    onChange={(e) => {
                      if (e.target.value.length <= 60) {
                        setMetaTitle(e.target.value);
                      }
                    }}
                    maxLength={60}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  />
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                    metaTitle.length >= 50 && metaTitle.length <= 60 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {metaTitle.length >= 50 && metaTitle.length <= 60 ? 'Optimal length' : 'Adjust length'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="metaDescription" className="text-sm font-medium text-gray-700">Meta Description</Label>
                    <div className="flex items-center gap-2">
                      {metaDescription && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                      <span className="text-xs text-gray-500">{metaDescription.length}/160</span>
                    </div>
                  </div>
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    placeholder="Brief description for search results"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    maxLength={160}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 resize-none text-sm"
                  />
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                    metaDescription.length >= 150 && metaDescription.length <= 160 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {metaDescription.length >= 150 && metaDescription.length <= 160 ? 'Optimal length' : 'Adjust length'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="seoTags" className="text-sm font-medium text-gray-700">Tags</Label>
                    <div className="flex items-center gap-2">
                      {tags && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                      <span className="text-xs text-green-600 font-medium">AI Generated</span>
                    </div>
                  </div>
                  <Input
                    id="seoTags"
                    name="seoTags"
                    placeholder="gaming, review, guide, nintendo..."
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500">Separate tags with commas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
