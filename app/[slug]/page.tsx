import { getArticleBySlug } from "@/lib/actions"
import { notFound } from "next/navigation"
import Image from "next/image"

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug)
  
  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">KOODOS</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          {article.featured_image && (
            <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden">
              <Image
                src={article.featured_image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            {article.excerpt && (
              <p className="text-xl text-gray-600 mb-4">{article.excerpt}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>By {article.author}</span>
              <span>•</span>
              <span>{new Date(article.created_at).toLocaleDateString()}</span>
              <span>•</span>
              <span>{article.views} views</span>
            </div>
          </header>
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </main>
    </div>
  )
}