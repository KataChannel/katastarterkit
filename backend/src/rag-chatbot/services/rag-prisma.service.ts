/**
 * RAG Prisma Service - Kết nối tới database testdata
 * Sử dụng riêng cho RAG Chatbot module
 * 
 * Database: testdata (116.118.49.243:55432)
 * Schema: prisma-rag/schema.prisma
 * Client: .prisma/rag-client (generated separately)
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '../../../node_modules/.prisma/rag-client';

@Injectable()
export class RagPrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RagPrismaService.name);

  constructor(private readonly configService: ConfigService) {
    // Sử dụng RAG_DATABASE_URL nếu có, fallback về DATABASE_URL
    const ragDatabaseUrl = configService.get<string>('RAG_DATABASE_URL') || 
                           configService.get<string>('DATABASE_URL');
    
    super({
      datasources: {
        db: {
          url: ragDatabaseUrl,
        },
      },
      log: process.env.NODE_ENV === 'development' 
        ? ['error', 'warn'] 
        : ['error'],
    });

    this.logger.log(`RAG Prisma initialized with URL: ${ragDatabaseUrl?.substring(0, 50)}...`);
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ RAG Prisma: Connected to testdata database');
      
      // Test connection
      const testResult = await this.$queryRaw<any[]>`SELECT NOW() as now`;
      this.logger.log(`   Database time: ${testResult[0]?.now}`);
    } catch (error) {
      this.logger.error('❌ RAG Prisma: Failed to connect to database', error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('RAG Prisma: Disconnected from database');
  }
}
