"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  Eye,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder,
  className,
}: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const insertTag = (openTag: string, closeTag = "") => {
    const textarea = document.getElementById(
      "rich-editor"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    const newContent =
      content.substring(0, start) +
      openTag +
      selectedText +
      closeTag +
      content.substring(end);

    onChange(newContent);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + openTag.length,
        start + openTag.length + selectedText.length
      );
    }, 0);
  };

  const toolbarButtons = [
    {
      icon: Bold,
      label: "Bold",
      action: () => insertTag("<strong>", "</strong>"),
    },
    { icon: Italic, label: "Italic", action: () => insertTag("<em>", "</em>") },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertTag("<ul>\n<li>", "</li>\n</ul>"),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertTag("<ol>\n<li>", "</li>\n</ol>"),
    },
    {
      icon: Link,
      label: "Link",
      action: () => insertTag('<a href="URL">', "</a>"),
    },
    {
      icon: ImageIcon,
      label: "Image",
      action: () => insertTag('<img src="URL" alt="Description" />'),
    },
    { icon: Code, label: "Code", action: () => insertTag("<code>", "</code>") },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-1">
          {toolbarButtons.map((button, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={button.action}
              title={button.label}
              className="h-8 w-8 p-0"
            >
              <button.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          {showPreview ? "Edit" : "Preview"}
        </Button>
      </div>

      {showPreview ? (
        <Card>
          <CardContent className="p-4">
            <div
              className="prose prose-sm max-w-none dark:prose-invert min-h-[200px]"
              dangerouslySetInnerHTML={{
                __html: content || "<p>Nothing to preview yet...</p>",
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Textarea
          id="rich-editor"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn("font-mono text-sm resize-none", className)}
        />
      )}

      <div className="text-xs text-muted-foreground">
        Use HTML tags for formatting: {"<h2>"}, {"<p>"}, {"<strong>"}, {"<em>"},{" "}
        {"<ul>"}, {"<li>"}, etc.
      </div>
    </div>
  );
}
