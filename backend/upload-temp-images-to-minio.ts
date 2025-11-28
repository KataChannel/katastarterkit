import * as fs from 'fs';
import * as path from 'path';
import { Client as MinioClient } from 'minio';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configuration
const TEMP_DOWNLOAD_DIR = './temp-images';
const MINIO_ENDPOINT = '116.118.49.243';
const MINIO_PORT = 12007;
const MINIO_ACCESS_KEY = 'minio-admin';
const MINIO_SECRET_KEY = 'minio-secret-2025';
const MINIO_BUCKET = 'rausach-uploads';
const MINIO_PUBLIC_URL = 'https://storage.rausachtrangia.com';
const TARGET_DOMAIN = 'rausach'; // Domain để update

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

interface UploadResult {
  productSlug: string;
  productName: string;
  dbProductId: string | null;
  featuredImage: string | null;
  uploadedImages: string[];
  status: 'success' | 'partial' | 'failed';
  message: string;
}

/**
 * Get MIME type from file extension
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
 * Load crawled products data
 */
function loadCrawledProducts(): ProductImageData[] {
  const crawledFile = path.join(TEMP_DOWNLOAD_DIR, 'crawled-products.json');
  
  if (!fs.existsSync(crawledFile)) {
    console.error('❌ crawled-products.json not found. Please run crawl first.');
    return [];
  }
  
  const data = fs.readFileSync(crawledFile, 'utf-8');
  return JSON.parse(data);
}

/**
 * Upload images from temp-images folder to MinIO
 */
async function uploadImagesToMinio(
  products: ProductImageData[]
): Promise<Map<string, string[]>> {
  console.log('\n☁️  Uploading images to MinIO...');
  
  const uploadedImagesByProduct = new Map<string, string[]>(); // productSlug -> [urls]
  
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
  
  try {
    await minioClient.setBucketPolicy(MINIO_BUCKET, JSON.stringify(policy));
    console.log('✅ Bucket policy set to public');
  } catch (error) {
    console.log('⚠️  Policy already set or error:', error.message);
  }
  
  let totalUploaded = 0;
  let totalSkipped = 0;
  
  for (const product of products) {
    console.log(`\n📦 Processing: ${product.productName}`);
    
    const productDir = path.join(TEMP_DOWNLOAD_DIR, product.productSlug);
    
    // Check if product folder exists
    if (!fs.existsSync(productDir) || !fs.statSync(productDir).isDirectory()) {
      console.log(`   ⚠️  Folder not found, skipping...`);
      totalSkipped++;
      continue;
    }
    
    const uploadedUrls: string[] = [];
    const files = fs.readdirSync(productDir);
    
    if (files.length === 0) {
      console.log(`   ⚠️  No images found in folder`);
      totalSkipped++;
      continue;
    }
    
    // Upload each image file
    for (const file of files) {
      const localPath = path.join(productDir, file);
      
      // Skip if not a file
      if (!fs.statSync(localPath).isFile()) {
        continue;
      }
      
      // Skip non-image files
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
        continue;
      }
      
      try {
        const objectName = `products/${product.productSlug}/${file}`;
        
        // Check if already exists in MinIO
        let exists = false;
        try {
          await minioClient.statObject(MINIO_BUCKET, objectName);
          exists = true;
        } catch (err) {
          // Object doesn't exist, continue to upload
        }
        
        if (exists) {
          console.log(`   ⏭️  Already exists: ${file}`);
          const existingUrl = `${MINIO_PUBLIC_URL}/${MINIO_BUCKET}/${objectName}`;
          uploadedUrls.push(existingUrl);
          continue;
        }
        
        // Upload to MinIO
        await minioClient.fPutObject(MINIO_BUCKET, objectName, localPath, {
          'Content-Type': getMimeType(localPath),
        });
        
        const newUrl = `${MINIO_PUBLIC_URL}/${MINIO_BUCKET}/${objectName}`;
        uploadedUrls.push(newUrl);
        totalUploaded++;
        
        console.log(`   ✅ Uploaded: ${file}`);
        
      } catch (error) {
        console.error(`   ❌ Failed to upload ${file}:`, error.message);
      }
    }
    
    if (uploadedUrls.length > 0) {
      uploadedImagesByProduct.set(product.productSlug, uploadedUrls);
    }
  }
  
  console.log(`\n✅ Upload complete: ${totalUploaded} new images uploaded, ${totalSkipped} skipped`);
  return uploadedImagesByProduct;
}

/**
 * Update products in database with uploaded images
 */
async function updateProductsInDatabase(
  products: ProductImageData[],
  uploadedImagesByProduct: Map<string, string[]>
): Promise<UploadResult[]> {
  console.log('\n🔗 Updating products in database...');
  
  const results: UploadResult[] = [];
  
  console.log(`✅ Updating products for domain: ${TARGET_DOMAIN}`);
  
  for (const productData of products) {
    const uploadedUrls = uploadedImagesByProduct.get(productData.productSlug);
    
    if (!uploadedUrls || uploadedUrls.length === 0) {
      results.push({
        productSlug: productData.productSlug,
        productName: productData.productName,
        dbProductId: null,
        featuredImage: null,
        uploadedImages: [],
        status: 'failed',
        message: 'No images uploaded',
      });
      continue;
    }
    
    try {
      // Try to find product by slug or name
      const cleanSlug = productData.productSlug.replace(/_\d+$/, ''); // Remove _ID suffix
      
      let dbProduct = await prisma.product.findFirst({
        where: {
          OR: [
            { slug: { contains: cleanSlug, mode: 'insensitive' } },
            { name: { contains: productData.productName, mode: 'insensitive' } },
          ],
        },
      });
      
      // If not found, try broader search
      if (!dbProduct) {
        const keywords = productData.productName
          .toLowerCase()
          .replace(/rau sạch -?/gi, '')
          .replace(/kim chi/gi, 'kim-chi')
          .trim()
          .split(/\s+/)
          .filter(w => w.length > 2);
        
        if (keywords.length > 0) {
          dbProduct = await prisma.product.findFirst({
            where: {
              name: {
                contains: keywords[0],
                mode: 'insensitive',
              },
            },
          });
        }
      }
      
      if (!dbProduct) {
        console.log(`   ⚠️  No matching product found for: ${productData.productName}`);
        results.push({
          productSlug: productData.productSlug,
          productName: productData.productName,
          dbProductId: null,
          featuredImage: null,
          uploadedImages: uploadedUrls,
          status: 'failed',
          message: 'Product not found in database',
        });
        continue;
      }
      
      // Update product with first image as featured image
      const featuredImage = uploadedUrls[0];
      
      await prisma.product.update({
        where: { id: dbProduct.id },
        data: {
          thumbnail: featuredImage,
          // Store all images in description or custom field if needed
          // For now, just update thumbnail
        },
      });
      
      console.log(`   ✅ Updated: ${dbProduct.name} (${uploadedUrls.length} images)`);
      console.log(`      Featured: ${featuredImage}`);
      
      results.push({
        productSlug: productData.productSlug,
        productName: productData.productName,
        dbProductId: dbProduct.id,
        featuredImage: featuredImage,
        uploadedImages: uploadedUrls,
        status: 'success',
        message: 'Updated successfully',
      });
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error(`   ❌ Error updating ${productData.productName}:`, errorMsg);
      results.push({
        productSlug: productData.productSlug,
        productName: productData.productName,
        dbProductId: null,
        featuredImage: null,
        uploadedImages: uploadedUrls,
        status: 'failed',
        message: errorMsg,
      });
    }
  }
  
  return results;
}

/**
 * Generate report
 */
function generateReport(results: UploadResult[]): void {
  console.log('\n' + '='.repeat(80));
  console.log('📊 MIGRATION REPORT');
  console.log('='.repeat(80));
  
  const successful = results.filter(r => r.status === 'success');
  const failed = results.filter(r => r.status === 'failed');
  
  console.log(`\n✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(`📊 Total: ${results.length}`);
  
  if (successful.length > 0) {
    console.log('\n✅ Successfully Updated Products:');
    successful.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.productName}`);
      console.log(`      Product ID: ${r.dbProductId}`);
      console.log(`      Featured Image: ${r.featuredImage}`);
      console.log(`      Total Images: ${r.uploadedImages.length}`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ Failed Products:');
    failed.forEach((r, i) => {
      console.log(`   ${i + 1}. ${r.productName}`);
      console.log(`      Reason: ${r.message}`);
      if (r.uploadedImages.length > 0) {
        console.log(`      Images uploaded but not linked: ${r.uploadedImages.length}`);
      }
    });
  }
  
  // Save report to file
  const reportPath = path.join(TEMP_DOWNLOAD_DIR, 'upload-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Full report saved to: ${reportPath}`);
  
  console.log('\n' + '='.repeat(80));
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Image Upload to MinIO and Database Update');
  console.log(`📁 Source: ${TEMP_DOWNLOAD_DIR}`);
  console.log(`☁️  Target: ${MINIO_PUBLIC_URL}/${MINIO_BUCKET}`);
  console.log(`🎯 Domain: ${TARGET_DOMAIN}`);
  console.log('='.repeat(80));
  
  try {
    // Step 1: Load crawled data
    console.log('\n📖 Step 1: Loading crawled products...');
    const products = loadCrawledProducts();
    
    if (products.length === 0) {
      console.log('❌ No products to process');
      return;
    }
    
    console.log(`✅ Loaded ${products.length} products`);
    
    // Step 2: Upload images to MinIO
    console.log('\n☁️  Step 2: Uploading images to MinIO...');
    const uploadedImagesByProduct = await uploadImagesToMinio(products);
    console.log(`✅ Images ready for ${uploadedImagesByProduct.size} products`);
    
    // Step 3: Update database
    console.log('\n🔗 Step 3: Updating product database...');
    const results = await updateProductsInDatabase(products, uploadedImagesByProduct);
    
    // Step 4: Generate report
    generateReport(results);
    
    console.log('\n✅ Migration completed!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run
main().catch(console.error);
