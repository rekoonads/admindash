-- Add missing columns to posts table if they don't exist
DO $$ 
BEGIN
    -- Add author column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'posts' AND column_name = 'author') THEN
        ALTER TABLE posts ADD COLUMN author TEXT NOT NULL DEFAULT 'Admin User';
    END IF;
    
    -- Add excerpt column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'posts' AND column_name = 'excerpt') THEN
        ALTER TABLE posts ADD COLUMN excerpt TEXT;
    END IF;
    
    -- Add featured_image column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'posts' AND column_name = 'featured_image') THEN
        ALTER TABLE posts ADD COLUMN featured_image TEXT;
    END IF;
    
    -- Add slug column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'posts' AND column_name = 'slug') THEN
        ALTER TABLE posts ADD COLUMN slug TEXT UNIQUE;
    END IF;
    
    -- Add tags column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'posts' AND column_name = 'tags') THEN
        ALTER TABLE posts ADD COLUMN tags JSONB DEFAULT '[]'::jsonb;
    END IF;
    
    -- Update existing posts to have slugs if they don't have them
    UPDATE posts 
    SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g'))
    WHERE slug IS NULL;
    
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author);
CREATE INDEX IF NOT EXISTS idx_posts_tags ON posts USING GIN(tags);
