import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixCategoryIds() {
  console.log('🔧 Fixing category_id references...')
  
  // Get all articles with their current category_id (which are slugs)
  const articles = await prisma.article.findMany({
    select: { id: true, category_id: true }
  })
  
  console.log('Found', articles.length, 'articles to fix')
  
  for (const article of articles) {
    // Find the category by slug
    const category = await prisma.category.findUnique({
      where: { slug: article.category_id },
      select: { id: true, slug: true, name: true }
    })
    
    if (category) {
      // Update the article to use category ID instead of slug
      await prisma.article.update({
        where: { id: article.id },
        data: { category_id: category.id }
      })
      console.log(`✅ Updated article ${article.id}: ${article.category_id} -> ${category.id}`)
    } else {
      console.log(`❌ Category not found for slug: ${article.category_id}`)
    }
  }
  
  console.log('✨ Migration completed!')
  await prisma.$disconnect()
}

fixCategoryIds().catch((error) => {
  console.error('💥 Migration failed:', error)
  process.exit(1)
})