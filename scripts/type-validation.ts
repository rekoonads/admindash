/**
 * TypeScript Type Validation
 * Ensures all field mappings are type-safe
 */

import { Article, User, Category } from '@prisma/client';
import type { Post } from '@/lib/prisma';

// Test type compatibility
function validateTypeCompatibility() {
  console.log('🔍 Validating TypeScript Type Compatibility...\n');

  // Test 1: Article to Post transformation
  const mockArticle: Article & { category: Category | null } = {
    id: 'test-id',
    title: 'Test Article',
    content: 'Test content',
    excerpt: 'Test excerpt',
    slug: 'test-slug',
    author_id: 'author-id',
    author_name: 'Test Author',
    category_id: 'category-id',
    status: 'PUBLISHED',
    type: 'NEWS',
    content_type: 'latest-updates',
    meta_title: null,
    meta_description: null,
    meta_keywords: null,
    featured_image: null,
    gallery_images: [],
    video_url: null,
    audio_url: null,
    game_title: null,
    developer: null,
    publisher: null,
    release_date: null,
    review_score: null,
    pros: [],
    cons: [],
    verdict: null,
    purchase_link: null,
    price: null,
    platforms: [],
    genres: [],
    views_count: 100,
    likes_count: 10,
    shares_count: 5,
    comments_count: 3,
    bookmarks_count: 2,
    is_breaking: false,
    is_featured: false,
    show_on_homepage: false,
    is_sponsored: false,
    is_premium: false,
    published_at: new Date(),
    scheduled_at: null,
    read_time: null,
    tags: [],
    category_tags: [],
    created_at: new Date(),
    updated_at: new Date(),
    category: {
      id: 'cat-id',
      name: 'Test Category',
      slug: 'test-category',
      description: null,
      color: null,
      icon: null,
      parent_id: null,
      is_active: true,
      sort_order: 0,
      created_at: new Date(),
      updated_at: new Date()
    }
  };

  // Transform to Post type
  const transformedPost: Post = {
    id: mockArticle.id,
    title: mockArticle.title,
    content: mockArticle.content,
    excerpt: mockArticle.excerpt,
    author: mockArticle.author_name || 'Unknown Author', // ✅ Mapped correctly
    author_name: mockArticle.author_name,
    status: mockArticle.status,
    category: mockArticle.category,
    category_id: mockArticle.category_id,
    views: mockArticle.views_count, // ✅ Mapped correctly
    views_count: mockArticle.views_count,
    slug: mockArticle.slug,
    created_at: mockArticle.created_at,
    updated_at: mockArticle.updated_at,
    featured_image: mockArticle.featured_image
  };

  console.log('✅ Article to Post transformation type-safe');

  // Test 2: User field access
  const mockUser: User = {
    id: 'user-id',
    clerk_id: 'clerk-id',
    email: 'test@example.com',
    username: 'testuser',
    first_name: 'Test',
    last_name: 'User',
    display_name: 'Test User',
    avatar: null,
    bio: null,
    website: null,
    location: null,
    birth_date: null,
    phone: null,
    role: 'USER',
    is_active: true,
    is_verified: false,
    is_premium: false,
    last_login: null,
    login_count: 0,
    created_at: new Date(),
    updated_at: new Date(),
    social_links: null,
    privacy_settings: null,
    notification_prefs: null
  };

  // Transform user data
  const transformedUser = {
    ...mockUser,
    name: mockUser.display_name || 
          `${mockUser.first_name || ''} ${mockUser.last_name || ''}`.trim() || 
          'Unknown User', // ✅ Computed correctly
    createdAt: mockUser.created_at // ✅ Mapped correctly
  };

  console.log('✅ User transformation type-safe');

  // Test 3: API response types
  interface UserAPIResponse {
    success: boolean;
    users: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      createdAt: Date;
      _count: {
        articles: number;
        comments: number;
        reactions: number;
      };
    }>;
    total: number;
  }

  // This should compile without errors
  const mockAPIResponse: UserAPIResponse = {
    success: true,
    users: [{
      id: transformedUser.id,
      name: transformedUser.name,
      email: transformedUser.email,
      role: transformedUser.role,
      createdAt: transformedUser.createdAt,
      _count: {
        articles: 0,
        comments: 0,
        reactions: 0
      }
    }],
    total: 1
  };

  console.log('✅ API response types compatible');

  console.log('\n🎉 All TypeScript validations passed!');
  console.log('- Article → Post mapping: ✅ Type-safe');
  console.log('- User field transformations: ✅ Type-safe');
  console.log('- API response types: ✅ Compatible');
}

// Export for testing
export { validateTypeCompatibility };

// Run if executed directly
if (require.main === module) {
  validateTypeCompatibility();
}