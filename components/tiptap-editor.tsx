"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  LinkIcon,
  ImageIcon,
  TableIcon,
  Palette,
  Highlighter,
  FileCode,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function TiptapEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  className,
}: TiptapEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [showCodeView, setShowCodeView] = useState(false);
  const [htmlContent, setHtmlContent] = useState(content);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlContent(html);
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
          "prose-headings:font-bold prose-headings:text-foreground",
          "prose-p:text-foreground prose-p:leading-relaxed",
          "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
          "prose-strong:text-foreground prose-strong:font-semibold",
          "prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:rounded",
          "prose-pre:bg-muted prose-pre:text-foreground",
          "prose-blockquote:border-l-primary prose-blockquote:text-foreground",
          "prose-ul:text-foreground prose-ol:text-foreground",
          "prose-li:text-foreground",
          "prose-table:text-foreground",
          "prose-th:text-foreground prose-td:text-foreground",
          className
        ),
      },
    },
  });

  // Update htmlContent when content prop changes
  useEffect(() => {
    if (editor && content !== htmlContent) {
      setHtmlContent(content);
      editor.commands.setContent(content);
    }
  }, [content, editor, htmlContent]);

  const addLink = useCallback(() => {
    if (linkUrl && editor) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
    }
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (imageUrl && editor) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
    }
  }, [editor, imageUrl]);

  const addTable = useCallback(() => {
    if (editor) {
      editor
        .chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    }
  }, [editor]);



  const toggleCodeView = useCallback(() => {
    if (showCodeView) {
      // Switching from code view to visual editor
      if (editor) {
        editor.commands.setContent(htmlContent);
        onChange(htmlContent);
      }
    } else {
      // Switching to code view
      if (editor) {
        setHtmlContent(editor.getHTML());
      }
    }
    setShowCodeView(!showCodeView);
  }, [showCodeView, editor, htmlContent, onChange]);

  const handleHtmlChange = useCallback(
    (newHtml: string) => {
      setHtmlContent(newHtml);
      onChange(newHtml);
    },
    [onChange]
  );

  // Show loading state until mounted and editor is ready
  if (!isMounted || !editor) {
    return (
      <div className={cn("border rounded-lg overflow-hidden", className)}>
        <div className="border-b bg-muted/30 p-2">
          <div className="animate-pulse">
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </div>
        <div className="min-h-[300px] p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
        <div className="border-t bg-muted/30 px-4 py-2">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="border-b bg-muted/30 p-2">
        <div className="flex flex-wrap items-center gap-1">
          {/* Code View Toggle */}
          <div className="flex items-center gap-1 mr-2">
            <Toggle
              size="sm"
              pressed={showCodeView}
              onPressedChange={toggleCodeView}
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <FileCode className="h-4 w-4" />
            </Toggle>
            <span className="text-xs text-muted-foreground">
              {showCodeView ? "Code" : "Visual"}
            </span>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Only show other toolbar items in visual mode */}
          {!showCodeView && (
            <>
              {/* Text Formatting */}
              <div className="flex items-center gap-1">
                <Toggle
                  size="sm"
                  pressed={editor.isActive("bold")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleBold().run()
                  }
                >
                  <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("italic")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleItalic().run()
                  }
                >
                  <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("underline")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleUnderline().run()
                  }
                >
                  <UnderlineIcon className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("strike")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleStrike().run()
                  }
                >
                  <Strikethrough className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("code")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleCode().run()
                  }
                >
                  <Code className="h-4 w-4" />
                </Toggle>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Headings */}
              <div className="flex items-center gap-1">
                <Toggle
                  size="sm"
                  pressed={editor.isActive("heading", { level: 1 })}
                  onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                >
                  <Heading1 className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("heading", { level: 2 })}
                  onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                >
                  <Heading2 className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("heading", { level: 3 })}
                  onPressedChange={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                >
                  <Heading3 className="h-4 w-4" />
                </Toggle>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Lists */}
              <div className="flex items-center gap-1">
                <Toggle
                  size="sm"
                  pressed={editor.isActive("bulletList")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                >
                  <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("orderedList")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                >
                  <ListOrdered className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive("blockquote")}
                  onPressedChange={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                >
                  <Quote className="h-4 w-4" />
                </Toggle>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Alignment */}
              <div className="flex items-center gap-1">
                <Toggle
                  size="sm"
                  pressed={editor.isActive({ textAlign: "left" })}
                  onPressedChange={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                >
                  <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive({ textAlign: "center" })}
                  onPressedChange={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                >
                  <AlignCenter className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive({ textAlign: "right" })}
                  onPressedChange={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                >
                  <AlignRight className="h-4 w-4" />
                </Toggle>
                <Toggle
                  size="sm"
                  pressed={editor.isActive({ textAlign: "justify" })}
                  onPressedChange={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                  }
                >
                  <AlignJustify className="h-4 w-4" />
                </Toggle>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Colors */}
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Palette className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Text Color</div>
                      <div className="grid grid-cols-6 gap-1">
                        {[
                          "#000000",
                          "#374151",
                          "#DC2626",
                          "#EA580C",
                          "#D97706",
                          "#65A30D",
                          "#059669",
                          "#0891B2",
                          "#2563EB",
                          "#7C3AED",
                          "#C026D3",
                          "#DC2626",
                        ].map((color) => (
                          <button
                            key={color}
                            className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() =>
                              editor.chain().focus().setColor(color).run()
                            }
                          />
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() =>
                          editor.chain().focus().unsetColor().run()
                        }
                      >
                        Remove Color
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Highlighter className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Highlight Color</div>
                      <div className="grid grid-cols-6 gap-1">
                        {[
                          "#FEF3C7",
                          "#DBEAFE",
                          "#D1FAE5",
                          "#FCE7F3",
                          "#E0E7FF",
                          "#FED7D7",
                        ].map((color) => (
                          <button
                            key={color}
                            className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            onClick={() =>
                              editor
                                .chain()
                                .focus()
                                .toggleHighlight({ color })
                                .run()
                            }
                          />
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() =>
                          editor.chain().focus().unsetHighlight().run()
                        }
                      >
                        Remove Highlight
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <Button variant="ghost" size="sm" onClick={addTable}>
                  <TableIcon className="h-4 w-4" />
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Media & Links */}
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Add Link</div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://example.com"
                          value={linkUrl}
                          onChange={(e) => setLinkUrl(e.target.value)}
                        />
                        <Button size="sm" onClick={addLink}>
                          Add
                        </Button>
                      </div>
                      {editor.isActive("link") && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full bg-transparent"
                          onClick={() =>
                            editor.chain().focus().unsetLink().run()
                          }
                        >
                          Remove Link
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Add Image</div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://example.com/image.jpg"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                        />
                        <Button size="sm" onClick={addImage}>
                          Add
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>


              </div>

              <Separator orientation="vertical" className="h-6" />

              {/* Undo/Redo */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Editor Content */}
      {showCodeView ? (
        <div className="min-h-[300px] max-h-[600px] overflow-y-auto">
          <Textarea
            value={htmlContent}
            onChange={(e) => handleHtmlChange(e.target.value)}
            className="min-h-[300px] max-h-[600px] font-mono text-sm border-0 rounded-none resize-none focus-visible:ring-0"
            placeholder="Enter HTML code here..."
          />
        </div>
      ) : (
        <EditorContent
          editor={editor}
          className="min-h-[300px] max-h-[600px] overflow-y-auto"
        />
      )}

      {/* Character Count */}
      <div className="border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground flex justify-between items-center">
        {showCodeView ? (
          <span>HTML Code View - {htmlContent.length} characters</span>
        ) : (
          <>
            <span>
              {editor.storage.characterCount?.characters() || 0} characters
            </span>
            <span>{editor.storage.characterCount?.words() || 0} words</span>
          </>
        )}
      </div>
    </div>
  );
}
