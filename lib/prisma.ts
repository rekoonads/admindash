import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const prisma = new PrismaClient().$extends(withAccelerate())

export { prisma }

// Helper types
export type Post = {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  author: string;
  status: "DRAFT" | "PUBLISHED" | "HIDDEN" | "SCHEDULED";
  category: string;
  views: number;
  featuredImage?: string | null;
  slug?: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Banner = {
  id: string;
  page: string;
  position: "TOP" | "BOTTOM" | "SIDEBAR";
  title?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
