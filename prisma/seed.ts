import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: "Latest Gaming Industry Trends",
        content: `<h1>Latest Gaming Industry Trends</h1>
<p>The gaming industry continues to evolve at a rapid pace, with new technologies and trends emerging every year. From cloud gaming to virtual reality, here are the key trends shaping the future of gaming.</p>
<h2>Cloud Gaming Revolution</h2>
<p>Cloud gaming services are becoming more mainstream, allowing players to stream high-quality games without expensive hardware.</p>
<h2>Mobile Gaming Growth</h2>
<p>Mobile gaming continues to dominate the market, with innovative gameplay mechanics and monetization strategies.</p>`,
        excerpt:
          "Explore the latest trends shaping the gaming industry in 2024.",
        author: "John Admin",
        status: "PUBLISHED",
        category: "news",
        slug: "latest-gaming-industry-trends",
        views: 1234,
        tags: ["gaming", "trends", "industry", "2024"],
      },
    }),
    prisma.post.create({
      data: {
        title: "E3 2024: What to Expect",
        content: `<h1>E3 2024: What to Expect</h1>
<p>The Electronic Entertainment Expo is back, and this year promises to be bigger than ever. Here's what we can expect from the biggest gaming event of the year.</p>
<h2>Major Announcements</h2>
<p>Industry insiders hint at several major game announcements and hardware reveals.</p>`,
        excerpt:
          "Get ready for the biggest gaming event of the year with our E3 2024 preview.",
        author: "Jane Admin",
        status: "DRAFT",
        category: "reviews",
        slug: "e3-2024-what-to-expect",
        views: 0,
        tags: ["e3", "events", "gaming", "preview"],
      },
    }),
    prisma.post.create({
      data: {
        title: "New Indie Game Spotlight",
        content: `<h1>New Indie Game Spotlight</h1>
<p>Independent game developers continue to push creative boundaries with innovative gameplay and unique art styles. Here are some indie games that caught our attention this month.</p>
<h2>Pixel Art Renaissance</h2>
<p>Many indie developers are embracing pixel art to create nostalgic yet modern gaming experiences.</p>`,
        excerpt:
          "Discover amazing indie games that are pushing creative boundaries.",
        author: "Mike Admin",
        status: "PUBLISHED",
        category: "game-guides",
        slug: "new-indie-game-spotlight",
        views: 856,
        tags: ["indie", "games", "spotlight", "pixel-art"],
      },
    }),
  ]);

  // Create sample banners
  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        page: "news",
        position: "TOP",
        title: "Gaming News Hub",
        content:
          "Stay updated with the latest gaming news and industry insights",
        imageUrl: "/placeholder.svg?height=200&width=800",
        linkUrl: "/news",
        isActive: true,
      },
    }),
    prisma.banner.create({
      data: {
        page: "news",
        position: "BOTTOM",
        title: "Subscribe to Our Newsletter",
        content: "Get weekly gaming news delivered to your inbox",
        imageUrl: "/placeholder.svg?height=150&width=600",
        linkUrl: "/newsletter",
        isActive: true,
      },
    }),
    prisma.banner.create({
      data: {
        page: "all",
        position: "TOP",
        title: "Welcome to Our Platform",
        content: "Discover the latest in gaming, tech, and entertainment",
        imageUrl: "/placeholder.svg?height=200&width=800",
        linkUrl: "/",
        isActive: true,
      },
    }),
  ]);

  console.log("✅ Database seeded successfully!");
  console.log(`📝 Created ${posts.length} posts`);
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
