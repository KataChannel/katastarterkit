/**
 * MinIO Client for Next.js
 * Object storage for file uploads
 */

import * as Minio from 'minio'

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
})

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'uploads'

// Ensure bucket exists
async function ensureBucket() {
  try {
    const exists = await minioClient.bucketExists(BUCKET_NAME)
    if (!exists) {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1')
      console.log(`✅ MinIO bucket created: ${BUCKET_NAME}`)
      
      // Set public read policy for uploaded files
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${BUCKET_NAME}/*`],
          },
        ],
      }
      await minioClient.setBucketPolicy(BUCKET_NAME, JSON.stringify(policy))
    }
  } catch (error) {
    console.error('❌ MinIO bucket error:', error)
  }
}

// Initialize bucket
if (typeof window === 'undefined') {
  ensureBucket()
}

export const minio = {
  /**
   * Upload file to MinIO
   */
  async uploadFile(
    file: Buffer,
    filename: string,
    contentType: string = 'application/octet-stream'
  ): Promise<{ url: string; key: string }> {
    const key = `${Date.now()}-${filename}`
    
    const metadata = {
      'Content-Type': contentType,
    }
    
    await minioClient.putObject(BUCKET_NAME, key, file, file.length, metadata)

    const url = await this.getFileUrl(key)
    return { url, key }
  },

  /**
   * Get file URL
   */
  async getFileUrl(key: string, expirySeconds?: number): Promise<string> {
    if (expirySeconds) {
      // Presigned URL (temporary)
      return await minioClient.presignedGetObject(BUCKET_NAME, key, expirySeconds)
    } else {
      // Public URL
      const endpoint = process.env.MINIO_ENDPOINT || 'localhost'
      const port = process.env.MINIO_PORT || '9000'
      const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http'
      return `${protocol}://${endpoint}:${port}/${BUCKET_NAME}/${key}`
    }
  },

  /**
   * Delete file from MinIO
   */
  async deleteFile(key: string): Promise<void> {
    await minioClient.removeObject(BUCKET_NAME, key)
  },

  /**
   * List files in bucket
   */
  async listFiles(prefix?: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const keys: string[] = []
      const stream = minioClient.listObjects(BUCKET_NAME, prefix, true)
      
      stream.on('data', (obj) => {
        if (obj.name) {
          keys.push(obj.name)
        }
      })
      
      stream.on('end', () => resolve(keys))
      stream.on('error', reject)
    })
  },
}

export default minio
