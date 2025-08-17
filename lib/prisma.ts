import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }

// Use Prisma generated types
export type { Article, User, Category, Banner } from '@prisma/client';

// Legacy alias for backward compatibility - updated to match schema
export type Post = {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  author: string; // Mapped from author_name
  author_name?: string | null;
  status: string;
  category?: { id: string; name: string; slug: string } | null;
  category_id?: string | null;
  views: number; // Mapped from views_count
  views_count: number;
  slug?: string | null;
  created_at: Date;
  updated_at: Date;
  featured_image?: string | null;
};
