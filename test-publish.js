// Test script to verify publishing works
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_password@ep-database.us-east-2.aws.neon.tech/neondb?sslmode=require"
    }
  }
})

async function testPublish() {
  try {
    console.log('Testing database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected')
    
    // Check if we can read articles
    const articles = await prisma.article.findMany({
      take: 5,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true, slug: true } }
      }
    })
    
    console.log(`✅ Found ${articles.length} articles`)
    
    // Check published articles
    const published = await prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      take: 3
    })
    
    console.log(`✅ Found ${published.length} published articles`)
    
    if (published.length > 0) {
      console.log('Sample published article:', {
        title: published[0].title,
        slug: published[0].slug,
        status: published[0].status
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

testPublish()