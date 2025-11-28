import { PrismaClient } from '@prisma/client';
import { Client as MinioClient } from 'minio';
import * as path from 'path';

const prisma = new PrismaClient();

// MinIO Configuration
const MINIO_ENDPOINT = '116.118.49.243';
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
    '.bmp': 'image/bmp',
    '.ico': 'image/x-icon',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Get file type from MIME type
 */
function getFileType(mimeType: string): 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT' | 'OTHER' {
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  if (mimeType.startsWith('audio/')) return 'AUDIO';
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'DOCUMENT';
  return 'OTHER';
}

/**
 * List all objects in MinIO bucket
 */
async function listMinioObjects(prefix: string = ''): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const objects: any[] = [];
    const objectsStream = minioClient.listObjectsV2(MINIO_BUCKET, prefix, true);
    
    objectsStream.on('data', (obj) => {
      objects.push(obj);
    });
    
    objectsStream.on('end', () => {
      resolve(objects);
    });
    
    objectsStream.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Sync MinIO files to database
 */
async function syncMinioToDatabase() {
  console.log('🔄 Starting sync MinIO files to database...\n');
  
  try {
    // Get or create admin user for file ownership
    let adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: 'admin@rausachtrangia.com' },
          { email: 'admin@example.com' },
          { username: 'admin' }
        ]
      }
    });
    
    if (!adminUser) {
      console.log('⚠️  Admin user not found, using first user...');
      adminUser = await prisma.user.findFirst();
      
      if (!adminUser) {
        console.error('❌ No users found in database. Please create a user first.');
        return;
      }
    }
    
    console.log(`✅ Using user: ${adminUser.email} (${adminUser.id})`);
    
    // Get or create a folder for products
    let productsFolder = await prisma.fileFolder.findFirst({
      where: {
        name: 'Products',
        userId: adminUser.id,
      }
    });
    
    if (!productsFolder) {
      productsFolder = await prisma.fileFolder.create({
        data: {
          name: 'Products',
          userId: adminUser.id,
          path: '/products',
        }
      });
      console.log('✅ Created "Products" folder');
    }
    
    // List all files in products/ prefix
    console.log('\n📂 Listing files from MinIO bucket...');
    const minioObjects = await listMinioObjects('products/');
    console.log(`   Found ${minioObjects.length} files in MinIO`);
    
    // Check existing files in database
    const existingFiles = await prisma.file.findMany({
      where: {
        folderId: productsFolder.id,
      },
      select: {
        filename: true,
        url: true,
      }
    });
    
    const existingUrls = new Set(existingFiles.map(f => f.url));
    console.log(`   Found ${existingFiles.length} files in database`);
    
    // Sync files
    let added = 0;
    let skipped = 0;
    let errors = 0;
    
    console.log('\n📥 Syncing files...\n');
    
    for (const obj of minioObjects) {
      const filename = path.basename(obj.name);
      const url = `${MINIO_PUBLIC_URL}/${MINIO_BUCKET}/${obj.name}`;
      
      // Skip if already exists
      if (existingUrls.has(url)) {
        skipped++;
        continue;
      }
      
      try {
        const mimeType = getMimeType(filename);
        const fileType = getFileType(mimeType);
        
        await prisma.file.create({
          data: {
            filename: filename,
            originalName: filename,
            mimeType: mimeType,
            size: obj.size,
            url: url,
            fileType: fileType,
            bucket: MINIO_BUCKET,
            path: obj.name,
            userId: adminUser.id,
            folderId: productsFolder.id,
          }
        });
        
        added++;
        
        if (added % 100 === 0) {
          console.log(`   ✅ Added ${added} files so far...`);
        }
        
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error(`   ❌ Error adding ${filename}:`, errorMsg);
        errors++;
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 SYNC SUMMARY');
    console.log('='.repeat(80));
    console.log(`✅ Files added to database: ${added}`);
    console.log(`⏭️  Files skipped (already exist): ${skipped}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📦 Total files in MinIO: ${minioObjects.length}`);
    console.log(`📦 Total files in database: ${existingFiles.length + added}`);
    console.log('='.repeat(80));
    
    console.log('\n✅ Sync completed!');
    console.log(`\n📁 Files are now available in /admin/filemanager under "Products" folder`);
    
  } catch (error) {
    console.error('❌ Sync failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 MinIO to Database Sync Tool');
  console.log(`📂 Bucket: ${MINIO_BUCKET}`);
  console.log(`🌐 Public URL: ${MINIO_PUBLIC_URL}`);
  console.log('='.repeat(80) + '\n');
  
  await syncMinioToDatabase();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
