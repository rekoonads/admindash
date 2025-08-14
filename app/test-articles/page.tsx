import { prisma } from '@/lib/prisma'

export default async function TestArticlesPage() {
  const articles = await prisma.article.findMany({
    take: 10,
    orderBy: { created_at: 'desc' },
    include: { category: true }
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Articles Debug</h1>
      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="border p-4 rounded">
            <h2 className="font-bold">{article.title}</h2>
            <p>Slug: {article.slug}</p>
            <p>Category ID: {article.category_id}</p>
            <p>Category Object: {article.category?.name} ({article.category?.slug})</p>
            <p>Status: {article.status}</p>
            <p>Expected URL: /{article.category?.slug}/{article.slug}</p>
            <a 
              href={`/${article.category?.slug}/${article.slug}`}
              className="text-blue-600 hover:underline"
              target="_blank"
            >
              Test Link →
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}