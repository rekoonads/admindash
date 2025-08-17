import { notFound } from "next/navigation"
import { Metadata } from "next"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Eye, Heart, Share2, User } from "lucide-react"

interface ArticlePageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

async function getArticle(categorySlug: string, articleSlug: string) {
  const article = await prisma.article.findFirst({
    where: {
      slug: articleSlug,
      status: "PUBLISHED",
      category: {
        slug: categorySlug
      }
    },
    include: {
      author: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          username: true,
          avatar: true,
        }
      },
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        }
      },
      _count: {
        select: {
          comments: true,
          reactions: true,
          bookmarks: true,
          shares: true,
        }
      }
    }
  })

  if (!article) return null

  // Increment view count
  await prisma.article.update({
    where: { id: article.id },
    data: { views_count: { increment: 1 } }
  })

  return article
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { category, slug } = await params
  const article = await getArticle(category, slug)
  
  if (!article) {
    return {
      title: "Article Not Found",
    }
  }

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt || article.title,
    keywords: article.meta_keywords,
    authors: [{ name: article.author_name || "Koodos Team" }],
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      type: "article",
      publishedTime: article.published_at?.toISOString(),
      modifiedTime: article.updated_at.toISOString(),
      authors: [article.author_name || "Koodos Team"],
      images: article.featured_image ? [
        {
          url: article.featured_image,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || article.title,
      images: article.featured_image ? [article.featured_image] : [],
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { category, slug } = await params
  const article = await getArticle(category, slug)

  if (!article) {
    notFound()
  }

  const authorName = article.author_name || 
    `${article.author?.first_name || ''} ${article.author?.last_name || ''}`.trim() ||
    article.author?.username ||
    "Koodos Team"

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li><Link href="/" className="hover:text-foreground">Home</Link></li>
          <li>/</li>
          <li>
            <Link href={`/${article.category?.slug}`} className="hover:text-foreground">
              {article.category?.name}
            </Link>
          </li>
          <li>/</li>
          <li className="text-foreground">{article.title}</li>
        </ol>
      </nav>

      {/* Article Header */}
      <header className="mb-8">
        <div className="mb-4">
          <Badge variant="secondary" className="mb-2">
            {article.category?.name}
          </Badge>
          {article.is_breaking && (
            <Badge variant="destructive" className="ml-2">
              Breaking
            </Badge>
          )}
          {article.is_featured && (
            <Badge variant="default" className="ml-2">
              Featured
            </Badge>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        
        {article.excerpt && (
          <p className="text-xl text-muted-foreground mb-6">{article.excerpt}</p>
        )}

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>By {authorName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.published_at?.toISOString()}>
              {article.published_at?.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          {article.read_time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{article.read_time} min read</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{article.views_count.toLocaleString()} views</span>
          </div>
        </div>

        {/* Social Actions */}
        <div className="flex items-center gap-2 mb-8">
          <Button variant="outline" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            {article.likes_count}
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </header>

      {/* Featured Image */}
      {article.featured_image && (
        <div className="mb-8">
          <Image
            src={article.featured_image}
            alt={article.title}
            width={800}
            height={400}
            className="w-full h-auto rounded-lg"
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <div 
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Review Score */}
      {article.review_score && (
        <div className="mt-8 p-6 bg-muted rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Review Score</h3>
          <div className="text-3xl font-bold text-primary">
            {article.review_score}/10
          </div>
          {article.verdict && (
            <p className="mt-2 text-muted-foreground">{article.verdict}</p>
          )}
        </div>
      )}

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}