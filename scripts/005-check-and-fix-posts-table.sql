-- First, let's see what columns currently exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'posts' 
ORDER BY ordinal_position;

-- Drop the table if it exists and recreate it with all necessary columns
DROP TABLE IF EXISTS posts CASCADE;

-- Create the posts table with all required columns
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL DEFAULT 'Admin User',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'hidden')),
  category TEXT NOT NULL DEFAULT 'news',
  views INTEGER DEFAULT 0,
  featured_image TEXT,
  slug TEXT UNIQUE,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_author ON posts(author);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- Create the update trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger
CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON posts
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data
INSERT INTO posts (title, content, excerpt, author, status, category, slug) VALUES
(
  'Welcome to Our Gaming News Platform',
  '<h1>Welcome to Our Gaming News Platform</h1><p>We are excited to launch our new gaming news platform where you can find the latest updates, reviews, and insights from the gaming world.</p><h2>What You Can Expect</h2><p>Our platform will feature:</p><ul><li>Latest gaming news and updates</li><li>In-depth game reviews</li><li>Industry analysis and trends</li><li>Exclusive interviews with developers</li></ul>',
  'Welcome to our new gaming news platform featuring the latest updates and reviews.',
  'Admin User',
  'published',
  'news',
  'welcome-to-our-gaming-news-platform'
),
(
  'Getting Started with Game Development',
  '<h1>Getting Started with Game Development</h1><p>Game development can seem daunting at first, but with the right tools and mindset, anyone can create amazing games.</p><h2>Choose Your Tools</h2><p>There are many game engines available today, each with their own strengths and weaknesses.</p>',
  'A beginner''s guide to starting your journey in game development.',
  'Admin User',
  'draft',
  'game-guides',
  'getting-started-with-game-development'
);
