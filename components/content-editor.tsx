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
  initialCategory = "latest-news",
  initialStatus = "DRAFT",
  editingPost,
  onSave,
  onPublish,
}: ContentEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [category, setCategory] = useState(initialCategory);
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

  const { user } = useUser();
  
  useEffect(() => {
    // Set author from user context
    if (user) {
      setAuthor(`${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User');
    }
  }, [user]);
  
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setContent(editingPost.content);
      setExcerpt(editingPost.excerpt || "");
      setCategory(editingPost.category || "latest-news");
      setStatus(editingPost.status as any);
      setTags(""); // Tags not in current schema
      setFeaturedImage(editingPost.featured_image || "");
      setVideoUrl(""); // Not in schema
      setThumbnail(""); // Not in schema
      setMetaTitle(editingPost.meta_title || "");
      setMetaDescription(editingPost.meta_description || "");
      setMetaKeywords(editingPost.meta_keywords || "");
      setIsFeatured(editingPost.is_featured || false);
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
      formData.append("author", author);
      formData.append("categoryId", category);
      console.log("Selected category:", category);
      formData.append("type", type === "News Article" ? "NEWS" : "ARTICLE");
      formData.append("status", status === "SCHEDULED" ? "SCHEDULED" : saveStatus);
      formData.append("tags", tags);
      if (featuredImage) formData.append("featuredImage", featuredImage);
      if (videoUrl) formData.append("videoUrl", videoUrl);
      if (thumbnail) formData.append("thumbnail", thumbnail);
      formData.append("metaTitle", metaTitle);
      formData.append("metaDescription", metaDescription);
      formData.append("metaKeywords", metaKeywords);
      formData.append("isFeatured", isFeatured.toString());
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

      if (editingPost) {
        await updatePost(editingPost.id, formData);
      } else {
        await createArticle(formData);
      }

      if (saveStatus === "PUBLISHED") {
        onPublish();
      } else {
        onSave();
      }
    } catch (error) {
      console.error("Error saving post:", error);
      alert(
        `Error saving post: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    "latest-news",
    "reviews",
    "gaming-hub",
    "tech-zone",
    "video-content",
    "anime-corner",
    "discussions",
    "deep-dives",
    "game-guides",
    "top-lists",
    "community",
    "comics-hub",
    "social",
    "gaming-news",
    "game-reviews",
    "gaming-videos",
    "pc-gaming",
    "playstation-5",
    "xbox",
    "nintendo-switch",
    "mobile-gaming",
    "anime",
    "comics",
    "esports",
    "tech-news",
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
            onClick={() => setShowPreview(true)}
            disabled={!title || !content}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
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
              <CardTitle className="text-base">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input
                  placeholder="Add tags (comma separated)..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Author</Label>
                <Input value={author} disabled />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="featured">Feature on Homepage</Label>
              </div>
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
