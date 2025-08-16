import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seeding...');

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@koodos.in' },
      update: {},
      create: {
        clerk_id: 'clerk_admin_001',
        email: 'admin@koodos.in',
        username: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        display_name: 'KOODOS Admin',
        bio: 'Gaming enthusiast and content creator',
        role: 'ADMIN',
        is_verified: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      }
    }),
    prisma.user.upsert({
      where: { email: 'editor@koodos.in' },
      update: {},
      create: {
        clerk_id: 'clerk_editor_001',
        email: 'editor@koodos.in',
        username: 'editor',
        first_name: 'Editor',
        last_name: 'User',
        display_name: 'Gaming Editor',
        bio: 'Professional game reviewer and journalist',
        role: 'EDITOR',
        is_verified: true,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      }
    }),
    prisma.user.upsert({
      where: { email: 'user@koodos.in' },
      update: {},
      create: {
        clerk_id: 'clerk_user_001',
        email: 'user@koodos.in',
        username: 'gamer123',
        first_name: 'John',
        last_name: 'Gamer',
        display_name: 'ProGamer123',
        bio: 'Casual gamer who loves RPGs and indie games',
        role: 'USER',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      }
    })
  ]);

  console.log('✅ Users created');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'gaming' },
      update: {},
      create: {
        name: 'Gaming',
        slug: 'gaming',
        description: 'All things gaming related',
        color: '#3B82F6',
        icon: 'gamepad-2',
        is_active: true,
        sort_order: 1,
      }
    }),
    prisma.category.upsert({
      where: { slug: 'reviews' },
      update: {},
      create: {
        name: 'Reviews',
        slug: 'reviews',
        description: 'Game and tech reviews',
        color: '#EF4444',
        icon: 'star',
        is_active: true,
        sort_order: 2,
      }
    }),
    prisma.category.upsert({
      where: { slug: 'tech' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'tech',
        description: 'Latest in technology',
        color: '#10B981',
        icon: 'monitor',
        is_active: true,
        sort_order: 3,
      }
    })
  ]);

  console.log('✅ Categories created');

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'nintendo' },
      update: {},
      create: {
        name: 'Nintendo',
        slug: 'nintendo',
        color: '#E60012',
        usage_count: 15,
        is_trending: true,
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'playstation' },
      update: {},
      create: {
        name: 'PlayStation',
        slug: 'playstation',
        color: '#003791',
        usage_count: 20,
        is_trending: true,
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'xbox' },
      update: {},
      create: {
        name: 'Xbox',
        slug: 'xbox',
        color: '#107C10',
        usage_count: 18,
        is_trending: true,
      }
    }),
    prisma.tag.upsert({
      where: { slug: 'pc-gaming' },
      update: {},
      create: {
        name: 'PC Gaming',
        slug: 'pc-gaming',
        color: '#FF6B35',
        usage_count: 25,
        is_trending: true,
      }
    })
  ]);

  console.log('✅ Tags created');

  // Create sample games
  const games = await Promise.all([
    prisma.game.upsert({
      where: { slug: 'the-legend-of-zelda-tears-of-the-kingdom' },
      update: {},
      create: {
        title: 'The Legend of Zelda: Tears of the Kingdom',
        slug: 'the-legend-of-zelda-tears-of-the-kingdom',
        description: 'An epic adventure awaits in the kingdom of Hyrule',
        developer: 'Nintendo EPD',
        publisher: 'Nintendo',
        release_date: new Date('2023-05-12'),
        rating: 'E10+',
        metacritic: 96,
        cover_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
        platforms: ['NINTENDO_SWITCH'],
        genres: ['ACTION', 'ADVENTURE', 'RPG'],
      }
    }),
    prisma.game.upsert({
      where: { slug: 'cyberpunk-2077' },
      update: {},
      create: {
        title: 'Cyberpunk 2077',
        slug: 'cyberpunk-2077',
        description: 'An open-world, action-adventure RPG set in Night City',
        developer: 'CD Projekt RED',
        publisher: 'CD Projekt',
        release_date: new Date('2020-12-10'),
        rating: 'M',
        metacritic: 86,
        cover_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
        platforms: ['PC', 'PS5', 'PS4', 'XBOX_SERIES', 'XBOX_ONE'],
        genres: ['ACTION', 'RPG', 'SHOOTER'],
      }
    })
  ]);

  console.log('✅ Games created');

  // Create sample articles
  const articles = await Promise.all([
    prisma.article.create({
      data: {
        title: 'The Legend of Zelda: Tears of the Kingdom Review',
        slug: 'zelda-tears-of-the-kingdom-review',
        content: `
          <h2>A Masterpiece of Game Design</h2>
          <p>The Legend of Zelda: Tears of the Kingdom is nothing short of a masterpiece. Building upon the foundation laid by Breath of the Wild, this sequel expands the formula in ways that feel both familiar and revolutionary.</p>
          
          <h3>Gameplay Innovation</h3>
          <p>The new Fuse ability allows players to combine objects in creative ways, leading to emergent gameplay moments that feel genuinely surprising. Whether you're attaching a boulder to a stick to create a hammer or fusing arrows with various materials for different effects, the system encourages experimentation.</p>
          
          <h3>Visual Splendor</h3>
          <p>Despite the Switch's hardware limitations, Tears of the Kingdom manages to deliver breathtaking vistas and impressive technical achievements. The seamless transition between the surface, sky islands, and underground areas is particularly noteworthy.</p>
          
          <h3>Conclusion</h3>
          <p>Tears of the Kingdom is a rare sequel that not only lives up to its predecessor but surpasses it in meaningful ways. It's a testament to Nintendo's commitment to innovation and quality.</p>
        `,
        excerpt: 'Our comprehensive review of Nintendo\'s latest Zelda masterpiece',
        author_id: users[1].id,
        status: 'PUBLISHED',
        type: 'GAME_REVIEW',
        content_type: 'game-reviews',
        featured_image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop',
        meta_title: 'Zelda: Tears of the Kingdom Review - A Gaming Masterpiece',
        meta_description: 'Our in-depth review of The Legend of Zelda: Tears of the Kingdom, exploring its innovative gameplay and stunning world design.',
        meta_keywords: 'Zelda, Tears of the Kingdom, Nintendo, Switch, review, gaming',
        game_title: 'The Legend of Zelda: Tears of the Kingdom',
        developer: 'Nintendo EPD',
        publisher: 'Nintendo',
        review_score: 9.5,
        pros: ['Innovative gameplay mechanics', 'Stunning world design', 'Excellent performance', 'Creative freedom'],
        cons: ['Some frame rate drops', 'Weapon durability system'],
        verdict: 'A masterpiece that redefines what an open-world game can be',
        purchase_link: 'https://www.nintendo.com/us/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/',
        price: '$69.99',
        platforms: ['NINTENDO_SWITCH'],
        genres: ['ACTION', 'ADVENTURE', 'RPG'],
        is_featured: true,
        show_on_homepage: true,
        published_at: new Date(),
        read_time: 8,
        tags: ['zelda', 'nintendo', 'switch', 'review', 'rpg'],
        views_count: 1250,
        likes_count: 89,
        shares_count: 34,
        comments_count: 12,
      }
    }),
    prisma.article.create({
      data: {
        title: 'Top 10 Indie Games You Should Play in 2024',
        slug: 'top-10-indie-games-2024',
        content: `
          <h2>The Best Independent Games of 2024</h2>
          <p>2024 has been an incredible year for indie games, with developers pushing creative boundaries and delivering unique experiences. Here are our top picks for the best indie games you should play this year.</p>
          
          <h3>1. Pizza Tower</h3>
          <p>A frantic 2D platformer inspired by Wario Land, Pizza Tower delivers non-stop action and incredible animation.</p>
          
          <h3>2. Cocoon</h3>
          <p>A puzzle adventure game that plays with perspective and scale in fascinating ways.</p>
          
          <h3>3. Sea of Stars</h3>
          <p>A turn-based RPG that captures the magic of classic JRPGs while adding modern touches.</p>
          
          <p>Each of these games represents the creativity and passion that makes the indie scene so special.</p>
        `,
        excerpt: 'Discover the most innovative and exciting indie games of 2024',
        author_id: users[0].id,
        status: 'PUBLISHED',
        type: 'LIST',
        content_type: 'top-lists',
        featured_image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop',
        meta_title: 'Top 10 Indie Games 2024 - Must-Play Independent Titles',
        meta_description: 'Discover the best indie games of 2024, from innovative puzzlers to retro-inspired adventures.',
        meta_keywords: 'indie games, 2024, independent, gaming, top 10, best games',
        is_featured: true,
        show_on_homepage: true,
        published_at: new Date(),
        read_time: 6,
        tags: ['indie', 'games', '2024', 'top-10', 'recommendations'],
        views_count: 890,
        likes_count: 67,
        shares_count: 23,
        comments_count: 8,
      }
    }),
    prisma.article.create({
      data: {
        title: 'How to Build the Perfect Gaming Setup on a Budget',
        slug: 'budget-gaming-setup-guide',
        content: `
          <h2>Gaming on a Budget: A Complete Guide</h2>
          <p>Building a great gaming setup doesn't have to break the bank. With careful planning and smart shopping, you can create an impressive gaming environment without spending a fortune.</p>
          
          <h3>Essential Components</h3>
          <ul>
            <li><strong>Monitor:</strong> Look for 1080p displays with good refresh rates</li>
            <li><strong>Peripherals:</strong> Invest in a decent keyboard and mouse combo</li>
            <li><strong>Audio:</strong> Good headphones are more important than expensive speakers</li>
            <li><strong>Seating:</strong> A comfortable chair is crucial for long gaming sessions</li>
          </ul>
          
          <h3>Money-Saving Tips</h3>
          <p>Consider buying refurbished equipment, look for sales during major shopping events, and don't feel pressured to buy everything at once. Build your setup gradually.</p>
        `,
        excerpt: 'Learn how to create an amazing gaming setup without spending a fortune',
        author_id: users[1].id,
        status: 'PUBLISHED',
        type: 'GUIDE',
        content_type: 'guides',
        featured_image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&h=400&fit=crop',
        meta_title: 'Budget Gaming Setup Guide - Build Your Dream Setup for Less',
        meta_description: 'Complete guide to building an amazing gaming setup on a budget, with tips and recommendations.',
        meta_keywords: 'gaming setup, budget, guide, pc gaming, peripherals, monitor',
        published_at: new Date(),
        read_time: 5,
        tags: ['gaming', 'setup', 'budget', 'guide', 'pc'],
        views_count: 654,
        likes_count: 45,
        shares_count: 18,
        comments_count: 15,
      }
    })
  ]);

  console.log('✅ Articles created');

  // Create sample comments
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great review! I completely agree about the innovative gameplay mechanics.',
        author_id: users[2].id,
        article_id: articles[0].id,
        is_approved: true,
        likes_count: 5,
      }
    }),
    prisma.comment.create({
      data: {
        content: 'Thanks for the budget setup guide! This is exactly what I needed.',
        author_id: users[2].id,
        article_id: articles[2].id,
        is_approved: true,
        likes_count: 3,
      }
    })
  ]);

  console.log('✅ Comments created');

  // Create sample reactions
  await Promise.all([
    prisma.reaction.create({
      data: {
        type: 'LIKE',
        user_id: users[2].id,
        article_id: articles[0].id,
      }
    }),
    prisma.reaction.create({
      data: {
        type: 'LOVE',
        user_id: users[0].id,
        article_id: articles[1].id,
      }
    })
  ]);

  console.log('✅ Reactions created');

  // Create sample bookmarks
  await Promise.all([
    prisma.bookmark.create({
      data: {
        user_id: users[2].id,
        article_id: articles[0].id,
      }
    }),
    prisma.bookmark.create({
      data: {
        user_id: users[2].id,
        article_id: articles[2].id,
      }
    })
  ]);

  console.log('✅ Bookmarks created');

  // Create sample notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        user_id: users[2].id,
        type: 'ARTICLE_PUBLISHED',
        title: 'New Article Published',
        message: 'A new Zelda review has been published!',
        article_id: articles[0].id,
        data: {
          article_title: articles[0].title,
          author_name: 'Gaming Editor'
        }
      }
    }),
    prisma.notification.create({
      data: {
        user_id: users[1].id,
        type: 'COMMENT',
        title: 'New Comment',
        message: 'Someone commented on your article',
        article_id: articles[0].id,
        data: {
          commenter_name: 'ProGamer123'
        }
      }
    })
  ]);

  console.log('✅ Notifications created');

  // Create sample banners
  await Promise.all([
    prisma.banner.create({
      data: {
        title: 'Welcome to KOODOS',
        content: 'Your ultimate gaming destination',
        image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=400&fit=crop',
        link_url: '/latest-updates',
        position: 'HERO',
        page: 'home',
        is_active: true,
        sort_order: 1,
      }
    }),
    prisma.banner.create({
      data: {
        title: 'Gaming Deals',
        content: 'Check out the latest gaming deals and discounts',
        image_url: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=200&fit=crop',
        link_url: '/deals',
        position: 'SIDEBAR',
        page: 'home',
        is_active: true,
        sort_order: 1,
      }
    })
  ]);

  console.log('✅ Banners created');

  console.log('🎉 Comprehensive database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });