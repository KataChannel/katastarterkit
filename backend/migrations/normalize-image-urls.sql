-- Migration: Normalize HTTP URLs to HTTPS
-- Date: 2024-11-29
-- Purpose: Fix Next.js Image Optimization 400 errors

-- ============================================
-- BACKUP FIRST!
-- ============================================
-- pg_dump -U postgres -d your_database > backup_before_url_migration.sql

BEGIN;

-- ============================================
-- 1. Products Table
-- ============================================

-- Update product image URLs
UPDATE products 
SET 
  image = REPLACE(image, 'http://rausachtrangia.com', 'https://rausachtrangia.com'),
  updated_at = NOW()
WHERE image LIKE 'http://rausachtrangia.com%';

-- Update product images array (if exists)
UPDATE products
SET 
  images = ARRAY(
    SELECT REPLACE(unnest(images)::text, 'http://rausachtrangia.com', 'https://rausachtrangia.com')
  ),
  updated_at = NOW()
WHERE EXISTS (
  SELECT 1 FROM unnest(images) AS img 
  WHERE img::text LIKE 'http://rausachtrangia.com%'
);

-- ============================================
-- 2. Blog Posts Table
-- ============================================

UPDATE blog_posts
SET 
  featured_image = REPLACE(featured_image, 'http://rausachtrangia.com', 'https://rausachtrangia.com'),
  updated_at = NOW()
WHERE featured_image LIKE 'http://rausachtrangia.com%';

-- Update content (images in HTML/Markdown)
UPDATE blog_posts
SET 
  content = REPLACE(content, 'http://rausachtrangia.com', 'https://rausachtrangia.com'),
  updated_at = NOW()
WHERE content LIKE '%http://rausachtrangia.com%';

-- ============================================
-- 3. Categories Table
-- ============================================

UPDATE categories
SET 
  image = REPLACE(image, 'http://rausachtrangia.com', 'https://rausachtrangia.com'),
  updated_at = NOW()
WHERE image LIKE 'http://rausachtrangia.com%';

-- ============================================
-- 4. Users Table (avatar/profile pictures)
-- ============================================

UPDATE users
SET 
  avatar = REPLACE(avatar, 'http://rausachtrangia.com', 'https://rausachtrangia.com'),
  updated_at = NOW()
WHERE avatar LIKE 'http://rausachtrangia.com%';

-- ============================================
-- 5. Pages Table
-- ============================================

UPDATE pages
SET 
  featured_image = REPLACE(featured_image, 'http://rausachtrangia.com', 'https://rausachtrangia.com'),
  content = REPLACE(content, 'http://rausachtrangia.com', 'https://rausachtrangia.com'),
  updated_at = NOW()
WHERE 
  featured_image LIKE 'http://rausachtrangia.com%'
  OR content LIKE '%http://rausachtrangia.com%';

-- ============================================
-- 6. Reviews Table (if has images)
-- ============================================

UPDATE reviews
SET 
  images = ARRAY(
    SELECT REPLACE(unnest(images)::text, 'http://rausachtrangia.com', 'https://rausachtrangia.com')
  ),
  updated_at = NOW()
WHERE EXISTS (
  SELECT 1 FROM unnest(images) AS img 
  WHERE img::text LIKE 'http://rausachtrangia.com%'
);

-- ============================================
-- 7. Website Settings
-- ============================================

UPDATE website_settings
SET 
  value = REPLACE(value::text, 'http://rausachtrangia.com', 'https://rausachtrangia.com')::jsonb,
  updated_at = NOW()
WHERE 
  value::text LIKE '%http://rausachtrangia.com%';

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check remaining HTTP URLs
DO $$
DECLARE
  products_count INTEGER;
  blog_posts_count INTEGER;
  categories_count INTEGER;
  users_count INTEGER;
  pages_count INTEGER;
BEGIN
  -- Count remaining HTTP URLs
  SELECT COUNT(*) INTO products_count FROM products WHERE image LIKE 'http://rausachtrangia.com%';
  SELECT COUNT(*) INTO blog_posts_count FROM blog_posts WHERE featured_image LIKE 'http://rausachtrangia.com%' OR content LIKE '%http://rausachtrangia.com%';
  SELECT COUNT(*) INTO categories_count FROM categories WHERE image LIKE 'http://rausachtrangia.com%';
  SELECT COUNT(*) INTO users_count FROM users WHERE avatar LIKE 'http://rausachtrangia.com%';
  SELECT COUNT(*) INTO pages_count FROM pages WHERE featured_image LIKE 'http://rausachtrangia.com%' OR content LIKE '%http://rausachtrangia.com%';
  
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'MIGRATION VERIFICATION';
  RAISE NOTICE '===========================================';
  RAISE NOTICE 'Remaining HTTP URLs:';
  RAISE NOTICE '  Products: %', products_count;
  RAISE NOTICE '  Blog Posts: %', blog_posts_count;
  RAISE NOTICE '  Categories: %', categories_count;
  RAISE NOTICE '  Users: %', users_count;
  RAISE NOTICE '  Pages: %', pages_count;
  RAISE NOTICE '===========================================';
  
  IF products_count + blog_posts_count + categories_count + users_count + pages_count > 0 THEN
    RAISE WARNING 'Still have HTTP URLs remaining! Check manually.';
  ELSE
    RAISE NOTICE '✅ All HTTP URLs converted to HTTPS successfully!';
  END IF;
END $$;

-- Show sample of converted URLs
SELECT 
  'products' as table_name,
  id,
  image as url
FROM products
WHERE image LIKE 'https://rausachtrangia.com%'
  AND updated_at > NOW() - INTERVAL '1 minute'
LIMIT 5;

COMMIT;

-- ============================================
-- ROLLBACK IF NEEDED
-- ============================================
-- ROLLBACK;
-- Then restore from backup:
-- psql -U postgres -d your_database < backup_before_url_migration.sql
