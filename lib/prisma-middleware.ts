// import { Prisma } from '@prisma/client'

// Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

// Ensure unique slug
async function ensureUniqueSlug(
  prisma: any,
  baseSlug: string,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.category.findUnique({
      where: { slug },
      select: { id: true }
    })

    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

export function setupPrismaMiddleware(prisma: any) {
  // Category slug generation middleware
  prisma.$use(async (params: any, next: any) => {
    // Handle Category create/update operations
    if (params.model === 'Category') {
      if (params.action === 'create' || params.action === 'update') {
        const data = params.args.data

        // Generate slug if name is provided
        if (data.name) {
          const baseSlug = generateSlug(data.name)
          const excludeId = params.action === 'update' ? params.args.where?.id : undefined
          data.slug = await ensureUniqueSlug(prisma, baseSlug, excludeId)
        }
      }

      // Handle upsert operations
      if (params.action === 'upsert') {
        const createData = params.args.create
        const updateData = params.args.update

        if (createData?.name) {
          const baseSlug = generateSlug(createData.name)
          createData.slug = await ensureUniqueSlug(prisma, baseSlug)
        }

        if (updateData?.name) {
          const baseSlug = generateSlug(updateData.name)
          const excludeId = params.args.where?.id
          updateData.slug = await ensureUniqueSlug(prisma, baseSlug, excludeId)
        }
      }
    }

    return next(params)
  })

  // Article slug generation middleware
  prisma.$use(async (params: any, next: any) => {
    if (params.model === 'Article') {
      if (params.action === 'create' || params.action === 'update') {
        const data = params.args.data

        // Generate article slug if title is provided
        if (data.title && !data.slug) {
          const baseSlug = generateSlug(data.title)
          let slug = baseSlug
          let counter = 1

          while (true) {
            const existing = await prisma.article.findUnique({
              where: { slug },
              select: { id: true }
            })

            const excludeId = params.action === 'update' ? params.args.where?.id : undefined
            if (!existing || (excludeId && existing.id === excludeId)) {
              data.slug = slug
              break
            }

            slug = `${baseSlug}-${counter}`
            counter++
          }
        }
      }
    }

    return next(params)
  })
}