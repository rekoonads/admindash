import { getArticleBySlug } from "@/lib/actions"
import { notFound } from "next/navigation"
import Image from "next/image"

interface PageProps {
  params: {
    category: string
    slug: string
  }
}

export default async function DynamicArticlePage({ params }: PageProps) {
  const { category, slug } = params
  
  // Get article
  const article = await getArticleBySlug(slug)
  
  if (!article) {
    console.log('Article not found for slug:', slug)
    notFound()
  }
  
  console.log('Article found:', {
    title: article.title,
    categorySlug: article.category?.slug,
    requestedCategory: category,
    status: article.status
  })
  
  // For now, allow all articles to show regardless of category mismatch
  // TODO: Re-enable strict checking once URLs are working
  // if (article.category?.slug !== category) {
  //   notFound()
  // }

  // Get category display name
  const categoryName = article.category?.name || category
  
  // Category-specific styling
  const getCategoryStyle = (categorySlug: string) => {
    const styles = {
      'game-guides': 'bg-blue-100 text-blue-800',
      'reviews': 'bg-green-100 text-green-800',
      'tech-news': 'bg-purple-100 text-purple-800',
      'anime': 'bg-pink-100 text-pink-800',
      'comics': 'bg-yellow-100 text-yellow-800',
      'esports': 'bg-red-100 text-red-800',
      'pc-gaming': 'bg-indigo-100 text-indigo-800',
      'playstation-5': 'bg-blue-100 text-blue-800',
      'xbox': 'bg-green-100 text-green-800',
      'nintendo-switch': 'bg-red-100 text-red-800',
      'mobile-gaming': 'bg-orange-100 text-orange-800',
      'science': 'bg-cyan-100 text-cyan-800',
      'video-content': 'bg-red-100 text-red-800',
      'latest-news': 'bg-gray-100 text-gray-800'
    }
    return styles[categorySlug as keyof typeof styles] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">KOODOS - {categoryName}</h1>
        </div>
      </header>
      
      {article.status === "DRAFT" && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p className="font-bold">🔍 Preview Mode</p>
          <p>This is a draft article and is not visible to the public.</p>
        </div>
      )}
      
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
            <div className="mb-4">
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${getCategoryStyle(category)}`}>
                {categoryName}
              </span>
            </div>
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