import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { is_active: true },
      orderBy: { sort_order: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
        icon: true
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, color, icon } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      )
    }

    // Generate unique slug
    const { generateSlug, ensureUniqueCategorySlug } = await import('@/lib/slug-utils')
    const baseSlug = generateSlug(name)
    const slug = await ensureUniqueCategorySlug(baseSlug)

    // Create category with generated slug
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        color,
        icon,
        is_active: true
      }
    })

    return NextResponse.json({
      success: true,
      category
    })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, color, icon, is_active } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      )
    }

    const updateData: any = {
      ...(description !== undefined && { description }),
      ...(color !== undefined && { color }),
      ...(icon !== undefined && { icon }),
      ...(is_active !== undefined && { is_active })
    }

    // If name is being updated, generate new slug
    if (name) {
      const { generateSlug, ensureUniqueCategorySlug } = await import('@/lib/slug-utils')
      const baseSlug = generateSlug(name)
      const slug = await ensureUniqueCategorySlug(baseSlug, id)
      updateData.name = name
      updateData.slug = slug
    }

    // Update category
    const category = await prisma.category.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      category
    })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    )
  }
}