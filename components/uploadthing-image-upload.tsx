"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X, LinkIcon, CheckCircle, AlertCircle, Settings } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { UploadButton, UploadDropzone } from "@/lib/uploadthing";

interface UploadThingImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  disabled?: boolean;
  className?: string;
}

export function UploadThingImageUpload({
  value,
  onChange,
  onRemove,
  disabled,
  className,
}: UploadThingImageUploadProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
    }
  };

  // Check if UploadThing is configured
  const isConfigured =
    typeof window !== "undefined" &&
    (process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID ||
      process.env.UPLOADTHING_APP_ID);

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
                <p className="font-medium">UploadThing not configured</p>
                <p className="mt-1">
                  Add UPLOADTHING_SECRET and UPLOADTHING_APP_ID to your
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

          {isConfigured ? (
            <>
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  console.log("Upload completed:", res);
                  if (res && res[0]) {
                    setUploadStatus("success");
                    onChange(res[0].url);
                    setTimeout(() => setUploadStatus("idle"), 2000);
                  }
                }}
                onUploadError={(error: Error) => {
                  console.error("Upload error:", error);
                  setUploadStatus("error");
                  setErrorMessage(error.message || "Upload failed");
                  setTimeout(() => {
                    setUploadStatus("idle");
                    setErrorMessage("");
                  }, 5000);
                }}
                onUploadBegin={(name) => {
                  console.log("Upload started:", name);
                  setUploadStatus("uploading");
                }}
                className={cn(
                  "ut-button:bg-primary ut-button:ut-readying:bg-primary/50",
                  "ut-label:text-primary ut-allowed-content:text-muted-foreground",
                  "ut-upload-icon:text-muted-foreground",
                  disabled && "opacity-50 pointer-events-none"
                )}
              />

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground mb-2">
                  Or use the button below
                </p>
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    console.log("Upload completed:", res);
                    if (res && res[0]) {
                      setUploadStatus("success");
                      onChange(res[0].url);
                      setTimeout(() => setUploadStatus("idle"), 2000);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    console.error("Upload error:", error);
                    setUploadStatus("error");
                    setErrorMessage(error.message || "Upload failed");
                    setTimeout(() => {
                      setUploadStatus("idle");
                      setErrorMessage("");
                    }, 5000);
                  }}
                  className={cn(
                    "ut-button:bg-primary ut-button:ut-readying:bg-primary/50",
                    disabled && "opacity-50 pointer-events-none"
                  )}
                />
              </div>
            </>
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
                  Configure UploadThing to enable file uploads
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

      <div className="text-xs text-muted-foreground">
        <p>
          💡 <strong>To enable file uploads:</strong>
        </p>
        <ol className="list-decimal list-inside mt-1 space-y-1">
          <li>
            Sign up at{" "}
            <a
              href="https://uploadthing.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              uploadthing.com
            </a>
          </li>
          <li>Create a new app and copy your API keys</li>
          <li>Add them to your .env.local file</li>
          <li>Restart your development server</li>
        </ol>
      </div>
    </div>
  );
}
