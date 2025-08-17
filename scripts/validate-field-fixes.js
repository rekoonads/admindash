/**
 * Field Mismatch Validation Script
 * Run this to verify all field name fixes are working correctly
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function validateFieldFixes() {
  console.log('🔍 Validating Field Name Fixes...\n');

  try {
    // Test 1: User model field access
    console.log('1. Testing User Model Fields...');
    const users = await prisma.user.findMany({
      take: 1,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        display_name: true,
        email: true,
        role: true,
        created_at: true,
        _count: {
          select: {
            articles: true,
            comments: true,
            reactions: true
          }
        }
      }
    });

    if (users.length > 0) {
      const user = users[0];
      console.log('✅ User fields accessible:', {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        display_name: user.display_name,
        created_at: user.created_at,
        counts: user._count
      });
    } else {
      console.log('⚠️  No users found in database');
    }

    // Test 2: Article model field access
    console.log('\n2. Testing Article Model Fields...');
    const articles = await prisma.article.findMany({
      take: 1,
      select: {
        id: true,
        title: true,
        author_name: true,
        views_count: true,
        created_at: true,
        published_at: true,
        category_id: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });

    if (articles.length > 0) {
      const article = articles[0];
      console.log('✅ Article fields accessible:', {
        id: article.id,
        title: article.title,
        author_name: article.author_name,
        views_count: article.views_count,
        created_at: article.created_at,
        published_at: article.published_at,
        category: article.category
      });
    } else {
      console.log('⚠️  No articles found in database');
    }

    // Test 3: Search functionality
    console.log('\n3. Testing Search with Correct Field Names...');
    const searchResults = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: 'test', mode: 'insensitive' } },
          { content: { contains: 'test', mode: 'insensitive' } },
          { author_name: { contains: 'test', mode: 'insensitive' } }
        ]
      },
      take: 1,
      select: {
        id: true,
        title: true,
        author_name: true
      }
    });
    console.log('✅ Search query executed successfully');

    // Test 4: Category relationships
    console.log('\n4. Testing Category Relationships...');
    const categoriesWithArticles = await prisma.category.findMany({
      take: 1,
      include: {
        articles: {
          take: 1,
          select: {
            id: true,
            title: true,
            author_name: true
          }
        }
      }
    });

    if (categoriesWithArticles.length > 0) {
      console.log('✅ Category relationships working:', {
        category: categoriesWithArticles[0].name,
        articles_count: categoriesWithArticles[0].articles.length
      });
    }

    // Test 5: Data transformation validation
    console.log('\n5. Testing Data Transformation Logic...');
    if (users.length > 0) {
      const user = users[0];
      const transformedName = user.display_name || 
        `${user.first_name || ''} ${user.last_name || ''}`.trim() || 
        'Unknown User';
      console.log('✅ User name transformation:', {
        original: { first_name: user.first_name, last_name: user.last_name, display_name: user.display_name },
        transformed: transformedName
      });
    }

    if (articles.length > 0) {
      const article = articles[0];
      const transformedData = {
        author: article.author_name || 'Unknown Author',
        views: article.views_count,
        createdAt: article.created_at
      };
      console.log('✅ Article data transformation:', transformedData);
    }

    console.log('\n🎉 All field validation tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- User model fields: ✅ Accessible');
    console.log('- Article model fields: ✅ Accessible');
    console.log('- Search functionality: ✅ Working');
    console.log('- Category relationships: ✅ Working');
    console.log('- Data transformations: ✅ Working');

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// Run validation if script is executed directly
if (require.main === module) {
  validateFieldFixes();
}

module.exports = { validateFieldFixes };