import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }

// Use Prisma generated types
export type { Article, User, Category, Banner } from '@prisma/client';

// Legacy alias for backward compatibility
export type Post = {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  author: string;
  status: string;
  category: string;
  views: number;
  slug?: string | null;
  created_at: Date;
  updated_at: Date;
  featured_image?: string | null;
};
