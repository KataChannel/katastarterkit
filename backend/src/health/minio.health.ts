import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class MinioHealthIndicator extends HealthIndicator {
  private minioClient: Client;

  constructor(private readonly configService: ConfigService) {
    super();
    
    // Create MinIO client for health checks
    this.minioClient = new Client({
      endPoint: this.configService.get('MINIO_ENDPOINT', 'localhost'),
      port: this.configService.get('MINIO_PORT', 9000),
      useSSL: this.configService.get('MINIO_USE_SSL', 'false') === 'true',
      accessKey: this.configService.get('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get('MINIO_SECRET_KEY', 'minioadmin'),
    });
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Test MinIO connection by listing buckets
      const buckets = await this.minioClient.listBuckets();
      
      return this.getStatus(key, true, {
        minio: 'up',
        message: 'MinIO connection is healthy',
        bucketsCount: buckets.length,
        buckets: buckets.map(bucket => bucket.name),
      });
    } catch (error) {
      const result = this.getStatus(key, false, {
        minio: 'down',
        message: error.message,
      });
      
      throw new HealthCheckError('MinIO health check failed', result);
    }
  }
}
