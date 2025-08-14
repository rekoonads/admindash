import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listCategories() {
  try {
    console.log('📋 Current categories in database:')
    const categories = await prisma.category.findMany({
      select: { id: true, name: true, slug: true, is_active: true },
      orderBy: { name: 'asc' }
    })
    
    console.log(`Total categories: ${categories.length}`)
    console.log('─'.repeat(60))
    
    categories.forEach((cat, i) => {
      console.log(`${i+1}. ${cat.name}`)
      console.log(`   Slug: '${cat.slug}'`)
      console.log(`   Active: ${cat.is_active}`)
      console.log(`   ID: ${cat.id}`)
      console.log('─'.repeat(40))
    })
    
    // Check recent articles and their categories
    console.log('\n🔍 Recent articles and their categories:')
    const articles = await prisma.article.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      select: { 
        title: true, 
        category_id: true, 
        slug: true,
        category: { select: { name: true, slug: true } }
      }
    })
    
    articles.forEach((art, i) => {
      console.log(`${i+1}. "${art.title}"`)
      console.log(`   Category ID: ${art.category_id}`)
      console.log(`   Category: ${art.category?.name || 'NOT FOUND'}`)
      console.log(`   Article Slug: ${art.slug}`)
      console.log('─'.repeat(40))
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listCategories()