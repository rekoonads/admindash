import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

async function migrateCategories() {
  console.log('🚀 Starting category migration...')

  try {
    // Get all categories to ensure they have proper slugs
    const categories = await prisma.category.findMany()

    console.log(`📋 Found ${categories.length} categories to migrate`)

    for (const category of categories) {
      const baseSlug = generateSlug(category.name)
      let slug = baseSlug
      let counter = 1

      // Ensure unique slug
      while (true) {
        const existing = await prisma.category.findUnique({
          where: { slug },
          select: { id: true }
        })

        if (!existing || existing.id === category.id) {
          break
        }

        slug = `${baseSlug}-${counter}`
        counter++
      }

      // Update category with generated slug
      await prisma.category.update({
        where: { id: category.id },
        data: { slug }
      })

      console.log(`✅ Updated "${category.name}" → "${slug}"`)
    }

    // Also ensure all existing categories have proper slugs
    const allCategories = await prisma.category.findMany()
    
    for (const category of allCategories) {
      if (!category.slug || category.slug.trim() === '') {
        const baseSlug = generateSlug(category.name)
        let slug = baseSlug
        let counter = 1

        // Ensure unique slug
        while (true) {
          const existing = await prisma.category.findUnique({
            where: { slug },
            select: { id: true }
          })

          if (!existing || existing.id === category.id) {
            break
          }

          slug = `${baseSlug}-${counter}`
          counter++
        }

        await prisma.category.update({
          where: { id: category.id },
          data: { slug }
        })

        console.log(`🔧 Fixed "${category.name}" → "${slug}"`)
      }
    }

    console.log('✨ Category migration completed successfully!')

    // Display final results
    const finalCategories = await prisma.category.findMany({
      select: { name: true, slug: true },
      orderBy: { name: 'asc' }
    })

    console.log('\n📊 Final category mapping:')
    finalCategories.forEach(cat => {
      console.log(`  "${cat.name}" → "${cat.slug}"`)
    })

  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration
if (require.main === module) {
  migrateCategories()
    .then(() => {
      console.log('🎉 Migration script completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Migration script failed:', error)
      process.exit(1)
    })
}

export { migrateCategories }