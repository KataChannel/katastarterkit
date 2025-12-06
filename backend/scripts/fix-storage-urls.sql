-- =====================================================
-- Script: Fix Storage URLs for Rausach Domain
-- Chuyển đổi URL từ storage.tazagroup.vn sang storage.rausachtrangia.com
-- =====================================================

-- Kiểm tra trước khi update
SELECT 'Products with tazagroup URLs:' as info;
SELECT id, name, thumbnail 
FROM "Product" 
WHERE thumbnail LIKE '%storage.tazagroup.vn%'
LIMIT 10;

SELECT 'ProductImages with tazagroup URLs:' as info;
SELECT id, url 
FROM "ProductImage" 
WHERE url LIKE '%storage.tazagroup.vn%'
LIMIT 10;

-- =====================================================
-- UPDATE Product.thumbnail
-- =====================================================
UPDATE "Product" 
SET thumbnail = REPLACE(thumbnail, 'storage.tazagroup.vn', 'storage.rausachtrangia.com')
WHERE thumbnail LIKE '%storage.tazagroup.vn%';

-- =====================================================
-- UPDATE ProductImage.url
-- =====================================================
UPDATE "ProductImage" 
SET url = REPLACE(url, 'storage.tazagroup.vn', 'storage.rausachtrangia.com')
WHERE url LIKE '%storage.tazagroup.vn%';

-- =====================================================
-- UPDATE Category.image (nếu có)
-- =====================================================
UPDATE "Category" 
SET image = REPLACE(image, 'storage.tazagroup.vn', 'storage.rausachtrangia.com')
WHERE image LIKE '%storage.tazagroup.vn%';

-- =====================================================
-- UPDATE WebsiteSetting (logo, favicon, etc.)
-- =====================================================
UPDATE "WebsiteSetting" 
SET value = REPLACE(value, 'storage.tazagroup.vn', 'storage.rausachtrangia.com')
WHERE value LIKE '%storage.tazagroup.vn%';

-- =====================================================
-- UPDATE Blog images (nếu có)
-- =====================================================
UPDATE "Blog" 
SET "featuredImage" = REPLACE("featuredImage", 'storage.tazagroup.vn', 'storage.rausachtrangia.com')
WHERE "featuredImage" LIKE '%storage.tazagroup.vn%';

UPDATE "Blog" 
SET content = REPLACE(content, 'storage.tazagroup.vn', 'storage.rausachtrangia.com')
WHERE content LIKE '%storage.tazagroup.vn%';

-- =====================================================
-- Kiểm tra kết quả
-- =====================================================
SELECT 'After update - Products with tazagroup URLs:' as info;
SELECT COUNT(*) as remaining_count FROM "Product" WHERE thumbnail LIKE '%storage.tazagroup.vn%';

SELECT 'After update - ProductImages with tazagroup URLs:' as info;
SELECT COUNT(*) as remaining_count FROM "ProductImage" WHERE url LIKE '%storage.tazagroup.vn%';

SELECT 'Done!' as status;
