import { NextResponse } from "next/server"
import { generateSlug, ensureUniqueCategorySlug } from "@/lib/slug-utils"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log('🧪 Testing category system...')
    
    // Test slug generation
    const testName = "Game Guides Test"
    const baseSlug = generateSlug(testName)
    console.log('Generated base slug:', baseSlug)
    
    // Test unique slug
    const uniqueSlug = await ensureUniqueCategorySlug(baseSlug)
    console.log('Unique slug:', uniqueSlug)
    
    // Test category creation
    const category = await prisma.category.create({
      data: {
        name: testName,
        slug: uniqueSlug,
        description: 'Test category for game guides',
        is_active: true
      }
    })
    
    console.log('✅ Category created:', category)
    
    // Test duplicate handling
    const duplicateSlug = await ensureUniqueCategorySlug(baseSlug)
    console.log('Next duplicate slug would be:', duplicateSlug)
    
    return NextResponse.json({
      success: true,
      message: 'Category system test completed',
      results: {
        baseSlug,
        uniqueSlug,
        category,
        duplicateSlug
      }
    })
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}