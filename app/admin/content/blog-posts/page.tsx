"use client"

import { PostManager } from "@/components/post-manager"

const mockBlogPosts = [
  {
    id: "1",
    title: "Getting Started with Our Platform",
    author: "John Admin",
    status: "published" as const,
    views: 1234,
    category: "Tutorial",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "New Features Update",
    author: "Jane Admin",
    status: "draft" as const,
    views: 0,
    category: "News",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Best Practices Guide",
    author: "Mike Admin",
    status: "published" as const,
    views: 856,
    category: "Guide",
    createdAt: "2024-01-13",
  },
]

export default function BlogPostsPage() {
  return <PostManager type="Blog Post" posts={mockBlogPosts} />
}
