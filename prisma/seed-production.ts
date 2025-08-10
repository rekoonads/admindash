import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding production database...");

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@koodos.in" },
    update: {},
    create: {
      clerkId: "admin_clerk_id",
      email: "admin@koodos.in",
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "gaming" },
      update: {},
      create: {
        name: "Gaming",
        slug: "gaming",
        description: "Latest gaming news and reviews",
        color: "#ef4444",
      },
    }),
    prisma.category.upsert({
      where: { slug: "tech" },
      update: {},
      create: {
        name: "Technology",
        slug: "tech",
        description: "Technology news and insights",
        color: "#3b82f6",
      },
    }),
    prisma.category.upsert({
      where: { slug: "entertainment" },
      update: {},
      create: {
        name: "Entertainment",
        slug: "entertainment",
        description: "Entertainment and media content",
        color: "#8b5cf6",
      },
    }),
  ]);

  // Create sample articles
  const articles = await Promise.all([
    prisma.article.upsert({
      where: { slug: "welcome-to-koodos" },
      update: {},
      create: {
        title: "Welcome to Koodos - Your Gaming & Tech Hub",
        slug: "welcome-to-koodos",
        content: `<h1>Welcome to Koodos</h1>
<p>Your ultimate destination for gaming, technology, and entertainment content.</p>
<h2>What We Offer</h2>
<ul>
<li>Latest gaming news and reviews</li>
<li>Technology insights and tutorials</li>
<li>Entertainment coverage</li>
<li>Community discussions</li>
</ul>`,
        excerpt: "Welcome to Koodos - your ultimate destination for gaming and tech content.",
        status: "PUBLISHED",
        type: "ARTICLE",
        featured: true,
        authorId: adminUser.id,
        categoryId: categories[0].id,
        publishedAt: new Date(),
      },
    }),
  ]);

  // Create banners
  const banners = await Promise.all([
    prisma.banner.upsert({
      where: { id: "main-banner" },
      update: {},
      create: {
        id: "main-banner",
        page: "all",
        position: "TOP",
        title: "Welcome to Koodos",
        content: "Your ultimate gaming and tech destination",
        isActive: true,
      },
    }),
  ]);

  console.log("✅ Production database seeded successfully!");
  console.log(`👤 Created admin user: ${adminUser.email}`);
  console.log(`📂 Created ${categories.length} categories`);
  console.log(`📝 Created ${articles.length} articles`);
  console.log(`🎯 Created ${banners.length} banners`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });