import { prisma } from "@/lib/prisma";

// Helper function to create notifications
export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  articleId?: string,
  data?: any
) {
  try {
    await prisma.notification.create({
      data: {
        user_id: userId,
        type: type as any,
        title,
        message,
        article_id: articleId,
        data: data || {},
      }
    });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}