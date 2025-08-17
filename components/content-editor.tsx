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
  initialCategory = "game-guides",
  initialStatus = "DRAFT",
  editingPost,
  onSave,
  onPublish,
}: ContentEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [category, setCategory] = useState(initialCategory || "game-guides");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [status, setStatus] = useState<
    "DRAFT" | "PUBLISHED" | "HIDDEN" | "SCHEDULED"
  >(initialStatus as any);
  const [tags, setTags] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [author, setAuthor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    if (category && !selectedCategories.includes(category)) {
      setSelectedCategories([...selectedCategories, category]);
    }
  }, [category]);
  
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setExcerpt(editingPost.excerpt || "");
      setCategory(editingPost.category?.slug || editingPost.category_id || "game-guides");
      // Handle category data properly
      const currentCategory = editingPost.category?.slug || editingPost.category_id || "game-guides";
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
      // Author is handled server-side from Clerk user data
      formData.append("categoryId", category);
      console.log("Sending categoryId to server:", category);
      formData.append("categories", JSON.stringify(selectedCategories));
      console.log("Selected categories:", selectedCategories);
      // Map content type to valid Prisma enum
      let articleType = "NEWS"; // default
      if (type.includes("Review") || type.includes("review")) articleType = "REVIEW";
      else if (type.includes("Guide") || type.includes("guide")) articleType = "GUIDE";
      else if (type.includes("Video") || type.includes("video")) articleType = "VIDEO";
      else if (type.includes("Anime") || type.includes("anime")) articleType = "ANIME";
      else if (type.includes("Comics") || type.includes("comics")) articleType = "COMICS";
      else if (type.includes("Tech") || type.includes("tech")) articleType = "TECH";
      else if (type.includes("Science") || type.includes("science")) articleType = "SCIENCE";
      else if (type.includes("Esports") || type.includes("esports")) articleType = "ESPORTS";
      
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
    <div className="space-y-6" onSubmit={handleFormSubmit}>
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
                // Use the actual slug from the saved article
                const slug = article?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").substring(0, 50);
                // Get the category slug from availableCategories
                const categorySlug = availableCategories.find(cat => cat.slug === category)?.slug || category;
                const url = `https://koodos.in/${categorySlug}/${slug}`;
                console.log('Preview URL:', url, 'Category:', categorySlug);
                window.open(url, '_blank');
              } catch (error) {
                console.error('Error saving for preview:', error);
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
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder={`Write your ${type.toLowerCase()} content here...`}
              className="min-h-[500px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ImageIcon className="h-4 w-4" />
                Media Content
              </CardTitle>
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
                <Label>Video URL</Label>
                <Input
                  placeholder="YouTube/Vimeo URL"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Video Thumbnail</Label>
                <Input
                  placeholder="Thumbnail image URL"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={type} onValueChange={(value) => setCategory(value)}>
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
                </>
              )}
            </CardContent>
          </Card>

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
                <Input
                  placeholder="Brief description for search results"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  maxLength={160}
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
