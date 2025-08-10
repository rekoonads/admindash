import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }

// Use Prisma generated types
export type { Article, User, Category, Banner } from '@prisma/client';

// Extended types with relations
export type ArticleWithRelations = Article & {
  author: { name: string | null; email: string };
  category: { name: string; slug: string };
};

// Legacy alias for backward compatibility
export type Post = ArticleWithRelations;
