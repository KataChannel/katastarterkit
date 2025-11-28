import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { Client as MinioClient } from 'minio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration
const OLD_SITE_URL = 'https://rausachtrangia.com';
const TEMP_DOWNLOAD_DIR = './temp-images';
const MINIO_ENDPOINT = '127.0.0.1';
const MINIO_PORT = 12007;
const MINIO_ACCESS_KEY = 'minio-admin';
const MINIO_SECRET_KEY = 'minio-secret-2025';
const MINIO_BUCKET = 'rausach-uploads';
const MINIO_PUBLIC_URL = 'https://storage.rausachtrangia.com';

// Initialize MinIO client
const minioClient = new MinioClient({
  endPoint: MINIO_ENDPOINT,
  port: MINIO_PORT,
  useSSL: false,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

interface ProductImageData {
  productName: string;
  productSlug: string;
  oldImageUrls: string[];
  productUrl: string;
}

// Create temp directory
if (!fs.existsSync(TEMP_DOWNLOAD_DIR)) {
  fs.mkdirSync(TEMP_DOWNLOAD_DIR, { recursive: true });
}

/**
 * Step 1: Crawl product pages and extract image URLs
 */
async function crawlProductImages(): Promise<ProductImageData[]> {
  console.log('🔍 Step 1: Crawling products from old website...');
  
  const products: ProductImageData[] = [];
  
  try {
    // Get homepage which has all product links
    const response = await axios.get(`${OLD_SITE_URL}/`, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    
    const $ = cheerio.load(response.data);
    
    // Find all product links (from homepage)
    const productLinks: string[] = [];
    $('a[href*="san-pham/"]').each((i, elem) => {
      const href = $(elem).attr('href');
      // Only get individual product pages (with _ID.html pattern)
      if (href && href.includes('.html') && href.match(/_\d+\.html$/) && !productLinks.includes(href)) {
        const fullUrl = href.startsWith('http') ? href : `${OLD_SITE_URL}/${href}`;
        productLinks.push(fullUrl);
      }
    });
    
    console.log(`📦 Found ${productLinks.length} product links`);
    
    // Crawl each product page - FULL MIGRATION (all products)
    for (const productUrl of productLinks) {
      try {
        console.log(`   Crawling: ${productUrl}`);
        const productResponse = await axios.get(productUrl, {
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });
        
        const $product = cheerio.load(productResponse.data);
        
        // Extract product name
        const productName = $product('h1').first().text().trim() || 
                           $product('title').text().trim();
        
        // Extract slug from URL
        const urlParts = productUrl.split('/');
        const productSlug = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
        
        // Extract image URLs from links (gallery structure: [](url1) [](url2))
        const imageUrls: string[] = [];
        
        // Find image gallery links - they appear as [](...) in source
        $product('a[href*="upload/"]').each((i, elem) => {
          const href = $product(elem).attr('href');
          if (href && (href.includes('upload/sanpham/') || href.includes('upload/hinhanh/'))) {
            const fullImageUrl = href.startsWith('http') ? href : `${OLD_SITE_URL}/${href}`;
            if (!imageUrls.includes(fullImageUrl)) {
              imageUrls.push(fullImageUrl);
            }
          }
        });
        
        // Also find img tags
        $product('img[src*="upload/"]').each((i, elem) => {
          const src = $product(elem).attr('src');
          if (src && (src.includes('upload/sanpham/') || src.includes('upload/hinhanh/'))) {
            const fullImageUrl = src.startsWith('http') ? src : `${OLD_SITE_URL}/${src}`;
            if (!imageUrls.includes(fullImageUrl)) {
              imageUrls.push(fullImageUrl);
            }
          }
        });
        
        if (imageUrls.length > 0) {
          products.push({
            productName,
            productSlug,
            oldImageUrls: imageUrls,
            productUrl,
          });
          console.log(`   ✅ Found ${imageUrls.length} images for: ${productName}`);
        }
        
        // Delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`   ❌ Error crawling ${productUrl}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error crawling product list:', error.message);
  }
  
  // Save crawled data
  fs.writeFileSync(
    path.join(TEMP_DOWNLOAD_DIR, 'crawled-products.json'),
    JSON.stringify(products, null, 2)
  );
  
  console.log(`\n✅ Crawled ${products.length} products with images`);
  return products;
}

/**
 * Step 2: Download images to local temp directory
 */
async function downloadImages(products: ProductImageData[]): Promise<Map<string, string>> {
  console.log('\n📥 Step 2: Downloading images...');
  
  const downloadedImages = new Map<string, string>(); // oldUrl -> localPath
  
  for (const product of products) {
    console.log(`\n📦 Downloading images for: ${product.productName}`);
    
    const productDir = path.join(TEMP_DOWNLOAD_DIR, product.productSlug);
    if (!fs.existsSync(productDir)) {
      fs.mkdirSync(productDir, { recursive: true });
    }
    
    for (let i = 0; i < product.oldImageUrls.length; i++) {
      const imageUrl = product.oldImageUrls[i];
      
      try {
        const response = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
          timeout: 30000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        });
        
        // Get file extension from URL or content-type
        const urlExt = path.extname(new URL(imageUrl).pathname);
        const contentType = response.headers['content-type'];
        let ext = urlExt || '.jpg';
        
        if (!urlExt && contentType) {
          if (contentType.includes('jpeg')) ext = '.jpg';
          else if (contentType.includes('png')) ext = '.png';
          else if (contentType.includes('webp')) ext = '.webp';
        }
        
        const filename = `image-${i + 1}${ext}`;
        const localPath = path.join(productDir, filename);
        
        fs.writeFileSync(localPath, response.data);
        downloadedImages.set(imageUrl, localPath);
        
        console.log(`   ✅ Downloaded: ${filename}`);
        
        // Delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`   ❌ Failed to download ${imageUrl}:`, error.message);
      }
    }
  }
  
  console.log(`\n✅ Downloaded ${downloadedImages.size} images`);
  return downloadedImages;
}

/**
 * Step 3: Upload images to MinIO
 */
async function uploadToMinio(
  downloadedImages: Map<string, string>,
  products: ProductImageData[]
): Promise<Map<string, string>> {
  console.log('\n☁️  Step 3: Uploading images to MinIO...');
  
  const uploadedImages = new Map<string, string>(); // oldUrl -> newUrl
  
  // Ensure bucket exists
  const bucketExists = await minioClient.bucketExists(MINIO_BUCKET);
  if (!bucketExists) {
    console.log(`Creating bucket: ${MINIO_BUCKET}`);
    await minioClient.makeBucket(MINIO_BUCKET, 'us-east-1');
  }
  
  // Set public policy for the bucket
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${MINIO_BUCKET}/*`],
      },
    ],
  };
  await minioClient.setBucketPolicy(MINIO_BUCKET, JSON.stringify(policy));
  
  for (const product of products) {
    console.log(`\n📦 Uploading images for: ${product.productName}`);
    
    for (const oldUrl of product.oldImageUrls) {
      const localPath = downloadedImages.get(oldUrl);
      if (!localPath || !fs.existsSync(localPath)) {
        console.log(`   ⚠️  Skipping missing file: ${oldUrl}`);
        continue;
      }
      
      try {
        const filename = path.basename(localPath);
        const objectName = `products/${product.productSlug}/${filename}`;
        
        await minioClient.fPutObject(MINIO_BUCKET, objectName, localPath, {
          'Content-Type': getMimeType(localPath),
        });
        
        const newUrl = `${MINIO_PUBLIC_URL}/${MINIO_BUCKET}/${objectName}`;
        uploadedImages.set(oldUrl, newUrl);
        
        console.log(`   ✅ Uploaded: ${objectName}`);
        
      } catch (error) {
        console.error(`   ❌ Failed to upload ${localPath}:`, error.message);
      }
    }
  }
  
  // Save mapping
  const mapping = Object.fromEntries(uploadedImages);
  fs.writeFileSync(
    path.join(TEMP_DOWNLOAD_DIR, 'image-url-mapping.json'),
    JSON.stringify(mapping, null, 2)
  );
  
  console.log(`\n✅ Uploaded ${uploadedImages.size} images to MinIO`);
  return uploadedImages;
}

/**
 * Step 4: Map images to existing products in database
 */
async function mapImagesToProducts(
  products: ProductImageData[],
  uploadedImages: Map<string, string>
): Promise<void> {
  console.log('\n🔗 Step 4: Mapping images to products in database...');
  
  const mappingResults = [];
  
  for (const productData of products) {
    try {
      // Find product in database by name or slug (fuzzy match)
      const dbProduct = await prisma.product.findFirst({
        where: {
          OR: [
            { slug: { contains: productData.productSlug, mode: 'insensitive' } },
            { name: { contains: productData.productName, mode: 'insensitive' } },
          ],
        },
      });
      
      if (!dbProduct) {
        console.log(`   ⚠️  No match found for: ${productData.productName}`);
        mappingResults.push({
          productName: productData.productName,
          status: 'no_match',
          oldImages: productData.oldImageUrls,
        });
        continue;
      }
      
      // Get new URLs for this product's images
      const newImageUrls = productData.oldImageUrls
        .map(oldUrl => uploadedImages.get(oldUrl))
        .filter(url => url !== undefined);
      
      if (newImageUrls.length === 0) {
        console.log(`   ⚠️  No uploaded images for: ${productData.productName}`);
        continue;
      }
      
      // Update product with new images
      await prisma.product.update({
        where: { id: dbProduct.id },
        data: {
          featuredImage: newImageUrls[0], // First image as featured
          images: newImageUrls, // All images
        },
      });
      
      console.log(`   ✅ Updated ${dbProduct.name} with ${newImageUrls.length} images`);
      mappingResults.push({
        productName: productData.productName,
        dbProductId: dbProduct.id,
        dbProductName: dbProduct.name,
        status: 'success',
        imageCount: newImageUrls.length,
      });
      
    } catch (error) {
      console.error(`   ❌ Error mapping ${productData.productName}:`, error.message);
      mappingResults.push({
        productName: productData.productName,
        status: 'error',
        error: error.message,
      });
    }
  }
  
  // Save mapping results
  fs.writeFileSync(
    path.join(TEMP_DOWNLOAD_DIR, 'mapping-results.json'),
    JSON.stringify(mappingResults, null, 2)
  );
  
  const successCount = mappingResults.filter(r => r.status === 'success').length;
  console.log(`\n✅ Successfully mapped ${successCount}/${products.length} products`);
}

/**
 * Step 5: Verify and report
 */
async function verifyMigration(): Promise<void> {
  console.log('\n✅ Step 5: Verifying migration...');
  
  const productsWithImages = await prisma.product.count({
    where: {
      featuredImage: { not: null },
    },
  });
  
  const productsWithoutImages = await prisma.product.count({
    where: {
      featuredImage: null,
    },
  });
  
  console.log('\n📊 Migration Summary:');
  console.log(`   Products with images: ${productsWithImages}`);
  console.log(`   Products without images: ${productsWithoutImages}`);
  
  // Sample products with new images
  const sampleProducts = await prisma.product.findMany({
    where: {
      featuredImage: { contains: 'storage.rausachtrangia.com' },
    },
    take: 5,
    select: {
      id: true,
      name: true,
      slug: true,
      featuredImage: true,
      images: true,
    },
  });
  
  console.log('\n🎨 Sample products with migrated images:');
  sampleProducts.forEach(p => {
    console.log(`\n   📦 ${p.name}`);
    console.log(`      Slug: ${p.slug}`);
    console.log(`      Featured: ${p.featuredImage}`);
    console.log(`      Total images: ${p.images?.length || 0}`);
  });
}

/**
 * Helper: Get MIME type from file extension
 */
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting image migration from old website...\n');
  console.log(`Source: ${OLD_SITE_URL}`);
  console.log(`Destination: ${MINIO_PUBLIC_URL}/${MINIO_BUCKET}`);
  console.log('='.repeat(60));
  
  try {
    // Step 1: Crawl
    const products = await crawlProductImages();
    
    if (products.length === 0) {
      console.log('\n⚠️  No products found. Please check the website structure and selectors.');
      return;
    }
    
    // Step 2: Download
    const downloadedImages = await downloadImages(products);
    
    if (downloadedImages.size === 0) {
      console.log('\n⚠️  No images downloaded. Check network connection and URLs.');
      return;
    }
    
    // Step 3: Upload to MinIO
    const uploadedImages = await uploadToMinio(downloadedImages, products);
    
    if (uploadedImages.size === 0) {
      console.log('\n⚠️  No images uploaded. Check MinIO configuration.');
      return;
    }
    
    // Step 4: Map to database
    await mapImagesToProducts(products, uploadedImages);
    
    // Step 5: Verify
    await verifyMigration();
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ Image migration completed!');
    console.log(`\n📁 Results saved in: ${TEMP_DOWNLOAD_DIR}`);
    console.log('   - crawled-products.json: Product data from old site');
    console.log('   - image-url-mapping.json: Old URL → New URL mapping');
    console.log('   - mapping-results.json: Database update results');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { crawlProductImages, downloadImages, uploadToMinio, mapImagesToProducts, verifyMigration };
