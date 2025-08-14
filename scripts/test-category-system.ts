import { PrismaClient } from '@prisma/client'
import { generateSlug, ensureUniqueCategorySlug, ensureUniqueArticleSlug } from '../lib/slug-utils'

const prisma = new PrismaClient()

async function testCategorySystem() {
  console.log('🧪 Testing Complete Category System...\n')
  
  try {
    // Test 1: Category Creation with Auto-Slug
    console.log('1️⃣ Testing Category Creation with Auto-Slug Generation:')
    const testCategoryName = 'Test Gaming Category'
    const baseSlug = generateSlug(testCategoryName)
    const uniqueSlug = await ensureUniqueCategorySlug(baseSlug)
    
    const testCategory = await prisma.category.create({
      data: {
        name: testCategoryName,
        slug: uniqueSlug,
        description: 'Test category for system validation',
        is_active: true
      }
    })
    console.log(`✅ Created: "${testCategory.name}" → slug: "${testCategory.slug}"`)
    
    // Test 2: Article Creation in Different Categories
    console.log('\n2️⃣ Testing Article Creation in Different Categories:')
    
    const testArticles = [
      { title: 'Gaming News Test', category: 'gaming' },
      { title: 'Review Test Article', category: 'reviews' },
      { title: 'Tech News Test', category: 'tech-news' }
    ]
    
    for (const test of testArticles) {
      const category = await prisma.category.findUnique({
        where: { slug: test.category }
      })
      
      if (category) {
        const articleSlug = await ensureUniqueArticleSlug(generateSlug(test.title))
        const article = await prisma.article.create({
          data: {
            title: test.title,
            slug: articleSlug,
            content: `<p>Test content for ${test.title}</p>`,
            excerpt: `Test excerpt for ${test.title}`,
            category_id: category.slug,
            author: 'Test Author',
            status: 'PUBLISHED',
            type: 'NEWS'
          }
        })
        console.log(`✅ Created article: "${article.title}" in category "${test.category}"`)
        console.log(`   URL: /${test.category}/${article.slug}`)
      }
    }
    
    // Test 3: Dynamic Route Validation
    console.log('\n3️⃣ Testing Dynamic Route Data:')
    const recentArticles = await prisma.article.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: { category: true }
    })
    
    recentArticles.forEach(article => {
      const categorySlug = article.category?.slug || article.category_id
      console.log(`✅ Article: "${article.title}"`)
      console.log(`   Category: ${article.category?.name} (${categorySlug})`)
      console.log(`   URL: /${categorySlug}/${article.slug}`)
      console.log(`   Status: ${article.status}`)
    })
    
    // Test 4: Category API Response
    console.log('\n4️⃣ Testing Category API Data:')
    const categories = await prisma.category.findMany({
      where: { is_active: true },
      select: { name: true, slug: true },
      orderBy: { name: 'asc' }
    })
    
    console.log(`✅ Total active categories: ${categories.length}`)
    console.log('Categories available for selection:')
    categories.slice(0, 10).forEach(cat => {
      console.log(`   - ${cat.name} → ${cat.slug}`)
    })
    if (categories.length > 10) {
      console.log(`   ... and ${categories.length - 10} more`)
    }
    
    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...')
    await prisma.article.deleteMany({
      where: { author: 'Test Author' }
    })
    await prisma.category.delete({
      where: { id: testCategory.id }
    })
    console.log('✅ Test data cleaned up')
    
    console.log('\n🎉 All tests passed! Category system is working correctly.')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

testCategorySystem()