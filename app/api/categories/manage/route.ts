import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      )
    }

    // Check if category has articles
    const articleCount = await prisma.article.count({
      where: { category_id: id }
    })

    if (articleCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category. It has ${articleCount} articles.` },
        { status: 400 }
      )
    }

    // Delete category
    await prisma.category.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, is_active } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      )
    }

    // Toggle category active status
    const category = await prisma.category.update({
      where: { id },
      data: { is_active: is_active ?? true }
    })

    return NextResponse.json({
      success: true,
      category
    })
  } catch (error) {
    console.error("Error updating category status:", error)
    return NextResponse.json(
      { error: "Failed to update category status" },
      { status: 500 }
    )
  }
}