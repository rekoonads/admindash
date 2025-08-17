import { Metadata } from "next"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Eye } from "lucide-react"

interface CategoryPageProps {
  params: {
    category: string
  }
  searchParams: {
    page?: string
  }
}

async function getCategory(slug: string) {
  return await prisma.category.findUnique({
    where: { slug, is_active: true }
  })
}

async function getCategoryArticles(categorySlug: string, page: number = 1) {
  const limit = 20
  const skip = (page - 1) * limit

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        category: {
          slug: categorySlug
        }
      },
      include: {
        author: {
          select: {
            first_name: true,
            last_name: true,
            username: true,
            avatar: true,
          }
        },
        category: {
          select: {
            name: true,
            slug: true,
          }
        }
      },
      orderBy: { published_at: "desc" },
      skip,
      take: limit,
    }),
    prisma.article.count({
      where: {
        status: "PUBLISHED",
        category: {
          slug: categorySlug
        }
      }
    })
  ])

  return { articles, total, pages: Math.ceil(total / limit) }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await getCategory(params.category)
  
  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category.name} - Koodos`,
    description: category.description || `Latest ${category.name.toLowerCase()} content from Koodos`,
    openGraph: {
      title: `${category.name} - Koodos`,
      description: category.description || `Latest ${category.name.toLowerCase()} content from Koodos`,
      type: "website",
    },
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const category = await getCategory(params.category)
  
  if (!category) {
    notFound()
  }

  const page = parseInt(searchParams.page || "1")
  const { articles, total, pages } = await getCategoryArticles(params.category, page)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Category Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-xl text-muted-foreground">{category.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          {total} articles
        </p>
      </header>

      {/* Articles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => {
          const authorName = article.author_name || 
            `${article.author?.first_name || ''} ${article.author?.last_name || ''}`.trim() ||
            article.author?.username ||
            "Koodos Team"

          return (
            <article key={article.id} className="group">
              <Link href={`/${params.category}/${article.slug}`}>
                <div className="space-y-4">
                  {/* Featured Image */}
                  {article.featured_image && (
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <Image
                        src={article.featured_image}
                        alt={article.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  )}

                  {/* Article Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {article.category?.name}
                      </Badge>
                      {article.is_featured && (
                        <Badge variant="default" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>

                    <h2 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h2>

                    {article.excerpt && (
                      <p className="text-muted-foreground line-clamp-3">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>By {authorName}</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={article.published_at?.toISOString()}>
                          {article.published_at?.toLocaleDateString()}
                        </time>
                      </div>
                      {article.read_time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{article.read_time}m</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{article.views_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          )
        })}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {page > 1 && (
            <Link
              href={`/${params.category}?page=${page - 1}`}
              className="px-4 py-2 border rounded-md hover:bg-muted"
            >
              Previous
            </Link>
          )}
          
          {Array.from({ length: Math.min(5, pages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(pages, page - 2 + i))
            return (
              <Link
                key={pageNum}
                href={`/${params.category}?page=${pageNum}`}
                className={`px-4 py-2 border rounded-md hover:bg-muted ${
                  pageNum === page ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                {pageNum}
              </Link>
            )
          })}

          {page < pages && (
            <Link
              href={`/${params.category}?page=${page + 1}`}
              className="px-4 py-2 border rounded-md hover:bg-muted"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  )
}