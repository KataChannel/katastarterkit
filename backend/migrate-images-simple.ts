import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { Client as MinioClient } from 'minio';

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
    console.log(`⏳ Starting full migration of ALL products...\n`);
    
    // Crawl each product page - FULL MIGRATION
    for (let idx = 0; idx < productLinks.length; idx++) {
      const productUrl = productLinks[idx];
      try {
        console.log(`[${idx + 1}/${productLinks.length}] Crawling: ${productUrl}`);
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
        const productSlug = urlParts[urlParts.length - 1]?.replace('.html', '') || 
                           urlParts[urlParts.length - 2];
        
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
        } else {
          console.log(`   ⚠️  No images found for: ${productName}`);
        }
        
        // Delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error: any) {
        console.error(`   ❌ Error crawling ${productUrl}:`, error.message);
      }
    }
    
  } catch (error: any) {
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
  let totalDownloaded = 0;
  let totalFailed = 0;
  
  for (let pIdx = 0; pIdx < products.length; pIdx++) {
    const product = products[pIdx];
    console.log(`\n[${pIdx + 1}/${products.length}] 📦 Downloading images for: ${product.productName}`);
    
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
        totalDownloaded++;
        
        // Delay between downloads
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (error: any) {
        console.error(`   ❌ Failed to download ${imageUrl}:`, error.message);
        totalFailed++;
      }
    }
  }
  
  console.log(`\n✅ Downloaded ${totalDownloaded} images (${totalFailed} failed)`);
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
  let totalUploaded = 0;
  let totalFailed = 0;
  
  // Ensure bucket exists
  try {
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
  } catch (error: any) {
    console.error(`⚠️  Bucket setup warning:`, error.message);
  }
  
  for (let pIdx = 0; pIdx < products.length; pIdx++) {
    const product = products[pIdx];
    console.log(`\n[${pIdx + 1}/${products.length}] 📦 Uploading images for: ${product.productName}`);
    
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
        totalUploaded++;
        
      } catch (error: any) {
        console.error(`   ❌ Failed to upload ${localPath}:`, error.message);
        totalFailed++;
      }
    }
  }
  
  // Save mapping
  const mapping = Object.fromEntries(uploadedImages);
  fs.writeFileSync(
    path.join(TEMP_DOWNLOAD_DIR, 'image-url-mapping.json'),
    JSON.stringify(mapping, null, 2)
  );
  
  console.log(`\n✅ Uploaded ${totalUploaded} images to MinIO (${totalFailed} failed)`);
  return uploadedImages;
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
  console.log('🚀 Starting FULL image migration from old website...\n');
  console.log(`Source: ${OLD_SITE_URL}`);
  console.log(`Destination: ${MINIO_PUBLIC_URL}/${MINIO_BUCKET}`);
  console.log('='.repeat(60));
  
  const startTime = Date.now();
  
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
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000 / 60).toFixed(2);
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ FULL Image migration completed!');
    console.log(`⏱️  Total time: ${duration} minutes`);
    console.log(`📊 Summary:`);
    console.log(`   - Products crawled: ${products.length}`);
    console.log(`   - Images downloaded: ${downloadedImages.size}`);
    console.log(`   - Images uploaded: ${uploadedImages.size}`);
    console.log(`\n📁 Results saved in: ${TEMP_DOWNLOAD_DIR}`);
    console.log('   - crawled-products.json: Product data from old site');
    console.log('   - image-url-mapping.json: Old URL → New URL mapping');
    console.log('   - {product-slug}/: Downloaded images organized by product');
    
  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
  }
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { crawlProductImages, downloadImages, uploadToMinio };
