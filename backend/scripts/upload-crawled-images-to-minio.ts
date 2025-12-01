#!/usr/bin/env bun
/**
 * Script upload hình ảnh đã crawl từ crawl-rausach lên MinIO
 * và cập nhật vào database sản phẩm tương ứng của domain rausach
 * 
 * Usage: cd backend && bun run scripts/upload-crawled-images-to-minio.ts
 */

import { PrismaClient } from '@prisma/client';
import * as Minio from 'minio';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment từ .env.prod.rausach
const envPath = path.join(__dirname, '../../env/.env.prod.rausach');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`✅ Loaded env from: ${envPath}`);
} else {
  // Fallback to default .env
  dotenv.config({ path: path.join(__dirname, '../.env') });
  console.log(`⚠️  Using default .env`);
}

// Force override to rausach database and MinIO config
// Theo cấu trúc từ cautrucdomain.txt:
// Domain: shop.rausachtrangia.com
// storage.rausachtrangia.com : MINIO_BUCKET_NAME: rausach-uploads
process.env.DATABASE_URL = 'postgresql://postgres:postgres@116.118.49.243:12003/rausachcore';
process.env.MINIO_BUCKET_NAME = 'rausach-uploads';
process.env.MINIO_PUBLIC_ENDPOINT = 'storage.rausachtrangia.com';
process.env.MINIO_PUBLIC_PORT = '443';
process.env.MINIO_PUBLIC_SSL = 'true';
process.env.MINIO_FORCE_HTTPS = 'true';

// Configuration
const CRAWL_IMAGES_DIR = path.join(__dirname, '../../crawl-rausach/images');
const MINIO_BUCKET = process.env.MINIO_BUCKET_NAME || 'rausach-uploads';
const MINIO_PRODUCTS_FOLDER = 'products';

// Vietnamese diacritics mapping for slug matching
const VIETNAMESE_MAP: { [key: string]: string } = {
  'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
  'đ': 'd', 'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
  'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
  'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
};

function slugify(text: string): string {
  let result = text.split('').map(c => VIETNAMESE_MAP[c] || VIETNAMESE_MAP[c.toLowerCase()] || c).join('');
  result = result.toLowerCase();
  result = result.replace(/[^\w\s-]/g, '');
  result = result.replace(/[-\s]+/g, '-');
  return result.trim().replace(/^-+|-+$/g, '');
}

function getContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  return mimeTypes[ext] || 'image/jpeg';
}

async function main() {
  console.log('='.repeat(60));
  console.log('🚀 UPLOAD CRAWLED IMAGES TO MINIO & UPDATE PRODUCTS');
  console.log('='.repeat(60));
  
  // Initialize Prisma
  const prisma = new PrismaClient();
  
  // Initialize MinIO Client
  const minioEndpoint = process.env.MINIO_INTERNAL_ENDPOINT || process.env.MINIO_ENDPOINT || '116.118.49.243';
  const minioPort = parseInt(process.env.MINIO_INTERNAL_PORT || process.env.MINIO_PORT || '12007');
  const minioAccessKey = process.env.MINIO_ACCESS_KEY || 'minio-admin';
  const minioSecretKey = process.env.MINIO_SECRET_KEY || 'minio-secret-2025';
  const minioUseSSL = process.env.MINIO_INTERNAL_SSL === 'true';
  
  console.log(`\n📦 MinIO Config:`);
  console.log(`   Endpoint: ${minioEndpoint}:${minioPort}`);
  console.log(`   Bucket: ${MINIO_BUCKET}`);
  console.log(`   SSL: ${minioUseSSL}`);
  
  const minioClient = new Minio.Client({
    endPoint: minioEndpoint,
    port: minioPort,
    useSSL: minioUseSSL,
    accessKey: minioAccessKey,
    secretKey: minioSecretKey,
  });
  
  // Ensure bucket exists
  try {
    const bucketExists = await minioClient.bucketExists(MINIO_BUCKET);
    if (!bucketExists) {
      await minioClient.makeBucket(MINIO_BUCKET);
      console.log(`✅ Created bucket: ${MINIO_BUCKET}`);
      
      // Set public policy
      const policy = {
        Version: '2012-10-17',
        Statement: [{
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${MINIO_BUCKET}/*`],
        }],
      };
      await minioClient.setBucketPolicy(MINIO_BUCKET, JSON.stringify(policy));
    }
    console.log(`✅ Bucket ready: ${MINIO_BUCKET}`);
  } catch (error) {
    console.error('❌ MinIO bucket error:', error);
    process.exit(1);
  }
  
  // Get all products from database
  console.log('\n📊 Fetching products from database...');
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      thumbnail: true,
    },
  });
  console.log(`   Found ${products.length} products`);
  
  // Build product lookup map by slug variations
  const productMap = new Map<string, typeof products[0]>();
  for (const product of products) {
    // Add by original slug
    productMap.set(product.slug.toLowerCase(), product);
    
    // Add by slugified name
    const nameSlug = slugify(product.name);
    productMap.set(nameSlug, product);
    
    // Add variations without "rau-sach-" prefix
    if (product.slug.startsWith('rau-sach-')) {
      productMap.set(product.slug.replace('rau-sach-', ''), product);
    }
    if (nameSlug.startsWith('rau-sach-')) {
      productMap.set(nameSlug.replace('rau-sach-', ''), product);
    }
  }
  
  // Read crawled images
  console.log(`\n📁 Reading images from: ${CRAWL_IMAGES_DIR}`);
  if (!fs.existsSync(CRAWL_IMAGES_DIR)) {
    console.error('❌ Crawl images directory not found!');
    process.exit(1);
  }
  
  const imageFiles = fs.readdirSync(CRAWL_IMAGES_DIR).filter(f => 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(f)
  );
  console.log(`   Found ${imageFiles.length} images`);
  
  // Public URL base
  const publicEndpoint = process.env.MINIO_PUBLIC_ENDPOINT || process.env.MINIO_ENDPOINT || minioEndpoint;
  const publicPort = process.env.MINIO_PUBLIC_PORT || '443';
  const publicSSL = process.env.MINIO_PUBLIC_SSL === 'true' || process.env.MINIO_FORCE_HTTPS === 'true';
  const protocol = publicSSL ? 'https' : 'http';
  const isDefaultPort = (protocol === 'https' && publicPort === '443') || (protocol === 'http' && publicPort === '80');
  const publicUrlBase = isDefaultPort ? `${protocol}://${publicEndpoint}` : `${protocol}://${publicEndpoint}:${publicPort}`;
  
  console.log(`   Public URL base: ${publicUrlBase}`);
  
  // Process images
  console.log('\n' + '='.repeat(60));
  console.log('📤 UPLOADING IMAGES & UPDATING PRODUCTS');
  console.log('='.repeat(60));
  
  let uploadedCount = 0;
  let matchedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  const results: Array<{image: string; product: string | null; status: string; url?: string}> = [];
  
  for (const imageFile of imageFiles) {
    const imagePath = path.join(CRAWL_IMAGES_DIR, imageFile);
    const imageSlug = imageFile.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '').toLowerCase();
    
    // Find matching product
    let matchedProduct = productMap.get(imageSlug);
    
    // Try variations if not found
    if (!matchedProduct) {
      // Try with "rau-sach-" prefix
      matchedProduct = productMap.get(`rau-sach-${imageSlug}`);
    }
    if (!matchedProduct) {
      // Try without "rau-sach-" prefix
      matchedProduct = productMap.get(imageSlug.replace('rau-sach-', ''));
    }
    
    // Fuzzy match: find product containing the slug
    if (!matchedProduct) {
      for (const [slug, product] of productMap) {
        if (slug.includes(imageSlug) || imageSlug.includes(slug)) {
          matchedProduct = product;
          break;
        }
      }
    }
    
    try {
      // Read image file
      const imageBuffer = fs.readFileSync(imagePath);
      const contentType = getContentType(imageFile);
      
      // Upload to MinIO
      const minioPath = `${MINIO_PRODUCTS_FOLDER}/${imageFile}`;
      await minioClient.putObject(MINIO_BUCKET, minioPath, imageBuffer, imageBuffer.length, {
        'Content-Type': contentType,
      });
      
      const publicUrl = `${publicUrlBase}/${MINIO_BUCKET}/${minioPath}`;
      uploadedCount++;
      
      if (matchedProduct) {
        // Update product thumbnail
        await prisma.product.update({
          where: { id: matchedProduct.id },
          data: { thumbnail: publicUrl },
        });
        
        matchedCount++;
        console.log(`✅ [${uploadedCount}] ${imageFile}`);
        console.log(`   → Product: ${matchedProduct.name}`);
        console.log(`   → URL: ${publicUrl}`);
        
        results.push({
          image: imageFile,
          product: matchedProduct.name,
          status: 'matched',
          url: publicUrl,
        });
      } else {
        console.log(`⚠️  [${uploadedCount}] ${imageFile} - No matching product`);
        console.log(`   → Uploaded to: ${publicUrl}`);
        
        results.push({
          image: imageFile,
          product: null,
          status: 'uploaded_no_match',
          url: publicUrl,
        });
        skippedCount++;
      }
    } catch (error: any) {
      console.error(`❌ Error processing ${imageFile}: ${error.message}`);
      errorCount++;
      results.push({
        image: imageFile,
        product: null,
        status: 'error',
      });
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total images:      ${imageFiles.length}`);
  console.log(`Uploaded:          ${uploadedCount}`);
  console.log(`Matched products:  ${matchedCount}`);
  console.log(`No match:          ${skippedCount}`);
  console.log(`Errors:            ${errorCount}`);
  
  // Save report
  const reportPath = path.join(CRAWL_IMAGES_DIR, '../upload-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      totalImages: imageFiles.length,
      uploaded: uploadedCount,
      matched: matchedCount,
      noMatch: skippedCount,
      errors: errorCount,
    },
    results,
  }, null, 2));
  console.log(`\n📄 Report saved to: ${reportPath}`);
  
  // List unmatched products (products without images)
  const productsWithImages = new Set(results.filter(r => r.product).map(r => r.product));
  const productsWithoutImages = products.filter(p => 
    !productsWithImages.has(p.name) && !p.thumbnail
  );
  
  if (productsWithoutImages.length > 0) {
    console.log(`\n⚠️  Products without images (${productsWithoutImages.length}):`);
    productsWithoutImages.slice(0, 20).forEach(p => {
      console.log(`   - ${p.name} (${p.slug})`);
    });
    if (productsWithoutImages.length > 20) {
      console.log(`   ... and ${productsWithoutImages.length - 20} more`);
    }
  }
  
  await prisma.$disconnect();
  console.log('\n✅ Done!');
}

main().catch(console.error);
