"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  X,
  Upload,
  LinkIcon,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface CloudinaryImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
  className?: string;
}

export function CloudinaryImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  className,
}: CloudinaryImageUploadProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if Cloudinary is configured
  const isConfigured = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select an image file");
      setUploadStatus("error");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("File size must be less than 10MB");
      setUploadStatus("error");
      return;
    }

    setUploadStatus("uploading");
    setUploadProgress(0);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      const uploadPromise = new Promise<any>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
      });

      xhr.open("POST", "/api/upload");
      xhr.send(formData);

      const result = await uploadPromise;

      if (result.url) {
        setUploadStatus("success");
        onChange(result.url);
        setTimeout(() => {
          setUploadStatus("idle");
          setUploadProgress(0);
        }, 2000);
      } else {
        throw new Error("No URL returned from upload");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Upload failed");
      setTimeout(() => {
        setUploadStatus("idle");
        setErrorMessage("");
        setUploadProgress(0);
      }, 5000);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled || uploadStatus === "uploading") return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      uploadFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      uploadFile(files[0]);
    }
  };

  if (value) {
    return (
      <div className={cn("relative", className)}>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
          <Image
            src={value || "/placeholder.svg"}
            alt="Featured image"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2">
            <Button
              type="button"
              onClick={onRemove}
              variant="destructive"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 truncate">{value}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardContent className="p-6">
          {!isConfigured && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2 text-yellow-800">
              <Settings className="h-4 w-4 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Cloudinary not configured</p>
                <p className="mt-1">
                  Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and other keys to your
                  .env.local file
                </p>
              </div>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Image uploaded successfully!</span>
            </div>
          )}

          {uploadStatus === "uploading" && (
            <div className="mb-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading... {uploadProgress}%
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {isConfigured ? (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25",
                disabled || uploadStatus === "uploading"
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer hover:border-primary/50"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() =>
                !disabled &&
                uploadStatus !== "uploading" &&
                fileInputRef.current?.click()
              }
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={disabled || uploadStatus === "uploading"}
              />

              {uploadStatus === "uploading" ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Uploading to Cloudinary...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <div className="text-sm">
                    <span className="font-medium text-primary">
                      Click to upload
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      or drag and drop
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-lg p-8 text-center border-muted-foreground/25">
              <div className="flex flex-col items-center gap-2">
                <Settings className="h-8 w-8 text-muted-foreground" />
                <div className="text-sm">
                  <span className="font-medium text-muted-foreground">
                    File Upload Unavailable
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Configure Cloudinary to enable file uploads
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {showUrlInput ? (
        <div className="space-y-2">
          <Label htmlFor="image-url">Image URL</Label>
          <div className="flex gap-2">
            <Input
              id="image-url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={disabled}
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim() || disabled}
            >
              Add
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowUrlInput(false)}
              disabled={disabled}
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowUrlInput(true)}
          className="w-full"
          disabled={disabled}
        >
          <LinkIcon className="h-4 w-4 mr-2" />
          Add Image URL Instead
        </Button>
      )}

      {!isConfigured && (
        <div className="text-xs text-muted-foreground">
          <p>
            💡 <strong>To enable file uploads:</strong>
          </p>
          <ol className="list-decimal list-inside mt-1 space-y-1">
            <li>
              Sign up at{" "}
              <a
                href="https://cloudinary.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                cloudinary.com
              </a>
            </li>
            <li>Get your Cloud Name, API Key, and API Secret</li>
            <li>Add them to your .env.local file</li>
            <li>Restart your development server</li>
          </ol>
        </div>
      )}
    </div>
  );
}
