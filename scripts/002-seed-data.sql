-- Insert sample posts
INSERT INTO posts (title, content, excerpt, author, status, category, views, slug) VALUES
(
  'Latest Gaming Industry Trends',
  '<h1>Latest Gaming Industry Trends</h1><p>The gaming industry continues to evolve at a rapid pace, with new technologies and trends emerging every year. From cloud gaming to virtual reality, here are the key trends shaping the future of gaming.</p><h2>Cloud Gaming Revolution</h2><p>Cloud gaming services are becoming more mainstream, allowing players to stream high-quality games without expensive hardware.</p><h2>Mobile Gaming Growth</h2><p>Mobile gaming continues to dominate the market, with innovative gameplay mechanics and monetization strategies.</p>',
  'Explore the latest trends shaping the gaming industry in 2024.',
  'John Admin',
  'published',
  'Gaming',
  1234,
  'latest-gaming-industry-trends'
),
(
  'E3 2024: What to Expect',
  '<h1>E3 2024: What to Expect</h1><p>The Electronic Entertainment Expo is back, and this year promises to be bigger than ever. Here''s what we can expect from the biggest gaming event of the year.</p><h2>Major Announcements</h2><p>Industry insiders hint at several major game announcements and hardware reveals.</p>',
  'Get ready for the biggest gaming event of the year with our E3 2024 preview.',
  'Jane Admin',
  'draft',
  'Events',
  0,
  'e3-2024-what-to-expect'
),
(
  'New Indie Game Spotlight',
  '<h1>New Indie Game Spotlight</h1><p>Independent game developers continue to push creative boundaries with innovative gameplay and unique art styles. Here are some indie games that caught our attention this month.</p><h2>Pixel Art Renaissance</h2><p>Many indie developers are embracing pixel art to create nostalgic yet modern gaming experiences.</p>',
  'Discover amazing indie games that are pushing creative boundaries.',
  'Mike Admin',
  'hidden',
  'Reviews',
  856,
  'new-indie-game-spotlight'
);

-- Insert sample banners
INSERT INTO banners (page, position, title, content, image_url, link_url, is_active) VALUES
(
  'news',
  'top',
  'Gaming News Hub',
  'Stay updated with the latest gaming news and industry insights',
  '/placeholder.svg?height=200&width=800',
  '/news',
  true
),
(
  'news',
  'bottom',
  'Subscribe to Our Newsletter',
  'Get weekly gaming news delivered to your inbox',
  '/placeholder.svg?height=150&width=600',
  '/newsletter',
  true
);
