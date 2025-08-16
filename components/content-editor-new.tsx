"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Send, Eye, CalendarIcon, Clock, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { getContentTypeFromPath } from "@/lib/slug-utils";

interface ContentEditorProps {
  type: string;
  onSave: () => void;
  onPublish: () => void;
  editingArticle?: any;
}

export function ContentEditor({ type, onSave, onPublish, editingArticle }: ContentEditorProps) {
  // Basic content fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentType, setContentType] = useState(type);
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "HIDDEN" | "SCHEDULED">("DRAFT");
  
  // Media fields
  const [featuredImage, setFeaturedImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  
  // SEO fields
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  
  // Gaming specific fields
  const [gameTitle, setGameTitle] = useState("");
  const [developer, setDeveloper] = useState("");
  const [publisher, setPublisher] = useState("");
  const [releaseDate, setReleaseDate] = useState<Date>();
  const [reviewScore, setReviewScore] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [verdict, setVerdict] = useState("");
  const [purchaseLink, setPurchaseLink] = useState("");
  const [price, setPrice] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  
  // Content flags
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [showOnHomepage, setShowOnHomepage] = useState(false);
  const [isSponsored, setIsSponsored] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  
  // Publishing
  const [scheduleDate, setScheduleDate] = useState<Date>();
  const [scheduleTime, setScheduleTime] = useState("09:00");
  
  // Tags
  const [tags, setTags] = useState("");
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useUser();

  // Load editing article data
  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title || "");
      setContent(editingArticle.content || "");
      setExcerpt(editingArticle.excerpt || "");
      setContentType(editingArticle.content_type || type);
      setStatus(editingArticle.status || "DRAFT");
      setFeaturedImage(editingArticle.featured_image || "");
      setVideoUrl(editingArticle.video_url || "");
      setAudioUrl(editingArticle.audio_url || "");
      setGalleryImages(editingArticle.gallery_images || []);
      setMetaTitle(editingArticle.meta_title || "");
      setMetaDescription(editingArticle.meta_description || "");
      setMetaKeywords(editingArticle.meta_keywords || "");
      setGameTitle(editingArticle.game_title || "");
      setDeveloper(editingArticle.developer || "");
      setPublisher(editingArticle.publisher || "");
      setReviewScore(editingArticle.review_score?.toString() || "");
      setPros(editingArticle.pros?.join(", ") || "");
      setCons(editingArticle.cons?.join(", ") || "");
      setVerdict(editingArticle.verdict || "");
      setPurchaseLink(editingArticle.purchase_link || "");
      setPrice(editingArticle.price || "");
      setSelectedPlatforms(editingArticle.platforms || []);
      setSelectedGenres(editingArticle.genres || []);
      setIsBreaking(editingArticle.is_breaking || false);
      setIsFeatured(editingArticle.is_featured || false);
      setShowOnHomepage(editingArticle.show_on_homepage || false);
      setIsSponsored(editingArticle.is_sponsored || false);
      setIsPremium(editingArticle.is_premium || false);
      setTags(editingArticle.tags?.join(", ") || "");
      if (editingArticle.scheduled_at) {
        setScheduleDate(new Date(editingArticle.scheduled_at));
        setScheduleTime(format(new Date(editingArticle.scheduled_at), "HH:mm"));
      }
    }
  }, [editingArticle, type]);

  const handleSave = async (saveStatus: "DRAFT" | "PUBLISHED" | "HIDDEN") => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required");
      return;
    }

    if (!user) {
      alert("You must be logged in to save articles");
      return;
    }

    setIsLoading(true);
    try {
      const articleData = {
        title: title.trim(),
        content: content,
        excerpt: excerpt.trim(),
        content_type: contentType,
        type: getContentTypeFromPath(`/${contentType}`),
        status: status === "SCHEDULED" ? "SCHEDULED" : saveStatus,
        
        // Media
        featured_image: featuredImage,
        video_url: videoUrl,
        audio_url: audioUrl,
        gallery_images: galleryImages,
        
        // SEO
        meta_title: metaTitle,
        meta_description: metaDescription,
        meta_keywords: metaKeywords,
        
        // Gaming specific
        game_title: gameTitle,
        developer: developer,
        publisher: publisher,
        release_date: releaseDate,
        review_score: reviewScore ? parseFloat(reviewScore) : null,
        pros: pros ? pros.split(',').map(p => p.trim()).filter(Boolean) : [],
        cons: cons ? cons.split(',').map(c => c.trim()).filter(Boolean) : [],
        verdict: verdict,
        purchase_link: purchaseLink,
        price: price,
        platforms: selectedPlatforms,
        genres: selectedGenres,
        
        // Content flags
        is_breaking: isBreaking,
        is_featured: isFeatured,
        show_on_homepage: showOnHomepage,
        is_sponsored: isSponsored,
        is_premium: isPremium,
        
        // Publishing
        scheduled_at: status === "SCHEDULED" && scheduleDate ? 
          new Date(scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate(), 
                   parseInt(scheduleTime.split(':')[0]), parseInt(scheduleTime.split(':')[1])) : null,
        
        // Tags
        tags: tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        
        // Author will be set server-side from Clerk user
      };

      const response = await fetch('/api/articles', {
        method: editingArticle ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingArticle ? { id: editingArticle.id, ...articleData } : articleData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save article');
      }

      const article = await response.json();

      if (saveStatus === "PUBLISHED") {
        onPublish();
      } else {
        onSave();
      }
      
      return article;
    } catch (error) {
      console.error("Error saving article:", error);
      alert(`Error saving article: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const platforms = [
    "PC", "PS5", "PS4", "XBOX_SERIES", "XBOX_ONE", "NINTENDO_SWITCH", 
    "MOBILE_IOS", "MOBILE_ANDROID", "VR", "STEAM_DECK", "WEB"
  ];

  const genres = [
    "ACTION", "ADVENTURE", "RPG", "STRATEGY", "SIMULATION", "SPORTS", 
    "RACING", "FIGHTING", "PUZZLE", "HORROR", "SHOOTER", "PLATFORMER", 
    "MMO", "INDIE", "CASUAL", "SURVIVAL", "SANDBOX"
  ];

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
              {editingArticle ? `Edit ${type}` : `Create ${type}`}
            </h1>
            <p className="text-muted-foreground">
              Write and publish your {type.toLowerCase()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
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
            {isLoading ? "Publishing..." : status === "SCHEDULED" ? "Schedule" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder={`Enter ${type.toLowerCase()} title`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Input
              id="excerpt"
              placeholder="Brief description of the article..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder={`Write your ${type.toLowerCase()} content here...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[500px]"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant={status === "PUBLISHED" ? "default" : "secondary"}>
                  {status.toLowerCase()}
                </Badge>
              </div>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
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
                          {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
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
                    <Label>Schedule Time</Label>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content Settings Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="latest-updates">Latest Updates</SelectItem>
                    <SelectItem value="game-reviews">Game Reviews</SelectItem>
                    <SelectItem value="movie-reviews">Movie Reviews</SelectItem>
                    <SelectItem value="tv-reviews">TV Reviews</SelectItem>
                    <SelectItem value="comic-reviews">Comic Reviews</SelectItem>
                    <SelectItem value="tech-reviews">Tech Reviews</SelectItem>
                    <SelectItem value="interviews">Interviews</SelectItem>
                    <SelectItem value="spotlights">Spotlights</SelectItem>
                    <SelectItem value="top-lists">Top Lists</SelectItem>
                    <SelectItem value="opinions">Opinions</SelectItem>
                    <SelectItem value="guides">Guides</SelectItem>
                    <SelectItem value="wiki">Wiki</SelectItem>
                    <SelectItem value="videos">Videos</SelectItem>
                    <SelectItem value="nintendo">Nintendo</SelectItem>
                    <SelectItem value="xbox">Xbox</SelectItem>
                    <SelectItem value="playstation">PlayStation</SelectItem>
                    <SelectItem value="pc-gaming">PC Gaming</SelectItem>
                    <SelectItem value="mobile-gaming">Mobile Gaming</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="cosplay">Cosplay</SelectItem>
                    <SelectItem value="science-comics">Science & Comics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  placeholder="gaming, review, nintendo, zelda..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">Separate tags with commas</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Content Flags</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="homepage"
                      checked={showOnHomepage}
                      onChange={(e) => setShowOnHomepage(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="homepage" className="text-sm">Show on Homepage</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="featured" className="text-sm">Featured Article</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="breaking"
                      checked={isBreaking}
                      onChange={(e) => setIsBreaking(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="breaking" className="text-sm">Breaking News</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sponsored"
                      checked={isSponsored}
                      onChange={(e) => setIsSponsored(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="sponsored" className="text-sm">Sponsored Content</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Media Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Featured Image URL</Label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input
                  placeholder="YouTube/Vimeo URL"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Audio URL</Label>
                <Input
                  placeholder="Audio file URL"
                  value={audioUrl}
                  onChange={(e) => setAudioUrl(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Gaming Specific Fields */}
          {(contentType.includes("game") || contentType.includes("review")) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gaming Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Game Title</Label>
                  <Input
                    placeholder="Game name"
                    value={gameTitle}
                    onChange={(e) => setGameTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Developer</Label>
                  <Input
                    placeholder="Game developer"
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Publisher</Label>
                  <Input
                    placeholder="Game publisher"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Review Score (0-10)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    placeholder="8.5"
                    value={reviewScore}
                    onChange={(e) => setReviewScore(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Pros</Label>
                  <Input
                    placeholder="Great graphics, Fun gameplay..."
                    value={pros}
                    onChange={(e) => setPros(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Cons</Label>
                  <Input
                    placeholder="Long loading times, Bugs..."
                    value={cons}
                    onChange={(e) => setCons(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Purchase Link</Label>
                  <Input
                    placeholder="https://store.steampowered.com/..."
                    value={purchaseLink}
                    onChange={(e) => setPurchaseLink(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Price</Label>
                  <Input
                    placeholder="$59.99"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* SEO Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">SEO Meta Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Meta Title</Label>
                <Input
                  placeholder="SEO title for search engines"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">{metaTitle.length}/60 characters</p>
              </div>
              <div className="space-y-2">
                <Label>Meta Description</Label>
                <Textarea
                  placeholder="Brief description for search results"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">{metaDescription.length}/160 characters</p>
              </div>
              <div className="space-y-2">
                <Label>Meta Keywords</Label>
                <Input
                  placeholder="gaming, review, guide (comma separated)"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}