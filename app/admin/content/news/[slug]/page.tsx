import {
  getPostBySlug,
  getPublishedPosts,
  incrementPostViews,
} from "@/lib/actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BannerDisplay } from "@/components/banner-display";
import { Eye, Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  // Increment views (fire and forget)
  incrementPostViews(post.id);

  // Get related posts
  const allPosts = await getPublishedPosts();
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" asChild>
          <Link href="/news">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Link>
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>

      <article className="max-w-4xl mx-auto">
        {post.featuredImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-8">
            <Image
              src={post.featuredImage || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        )}

        <header className="space-y-4 mb-8">
          <div className="flex items-center gap-4">
            <Badge variant="secondary">{post.category}</Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Eye className="h-4 w-4 mr-1" />
              {(post.views + 1).toLocaleString()} views
            </div>
          </div>

          <h1 className="text-4xl font-bold leading-tight">{post.title}</h1>

          {post.excerpt && (
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm text-muted-foreground border-t pt-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </header>

        <Card>
          <CardContent className="p-8">
            <div
              className="prose prose-gray max-w-none dark:prose-invert prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:leading-relaxed prose-a:text-primary hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>
      </article>

      {relatedPosts && relatedPosts.length > 0 && (
        <section className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <Card
                key={relatedPost.id}
                className="hover:shadow-lg transition-shadow overflow-hidden"
              >
                {relatedPost.featuredImage && (
                  <div className="relative aspect-video w-full">
                    <Image
                      src={relatedPost.featuredImage || "/placeholder.svg"}
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">
                    {relatedPost.category}
                  </Badge>
                  <h3 className="font-semibold line-clamp-2">
                    <Link
                      href={`/news/${relatedPost.slug}`}
                      className="hover:text-primary transition-colors"
                    >
                      {relatedPost.title}
                    </Link>
                  </h3>
                </CardHeader>
                <CardContent>
                  {relatedPost.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {relatedPost.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{relatedPost.author}</span>
                    <span>
                      {new Date(relatedPost.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <BannerDisplay page="news" position="bottom" />
    </div>
  );
}
