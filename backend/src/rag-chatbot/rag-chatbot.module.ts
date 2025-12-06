/**
 * RAG Chatbot Module - Rausach Domain
 * Module tích hợp RAG với Gemini AI cho hệ thống quản lý rau sạch
 * 
 * Kết nối tới database testdata riêng biệt qua RAG_DATABASE_URL
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

// Services
import {
  RagPrismaService,
  RagChatbotService,
  RagContextService,
  RagIntentService,
  RagGeminiService,
  RagTokenOptimizer,
} from './services';
import { RagHistoryService } from './services/rag-history.service';
import { RagConfigService } from './services/rag-config.service';

// Guards
import { RagAuthGuard, RagRateLimitGuard } from './guards';

// Controller & Resolver
import { RagChatbotController } from './rag-chatbot.controller';
import { RagChatbotResolver } from './rag-chatbot.resolver';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    UserModule, // Import UserModule instead of declaring UserService directly
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback-secret-key',
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [RagChatbotController],
  providers: [
    // RAG-specific Prisma client (connects to testdata database)
    RagPrismaService,
    
    // Config service (needed first)
    RagConfigService,
    
    // Guards
    RagAuthGuard,
    RagRateLimitGuard,
    
    // Core services
    RagContextService,
    RagIntentService,
    RagGeminiService,
    RagTokenOptimizer,
    RagHistoryService,
    RagChatbotService,
    
    // GraphQL Resolver
    RagChatbotResolver,
  ],
  exports: [
    RagPrismaService,
    RagChatbotService,
    RagContextService,
    RagIntentService,
    RagGeminiService,
    RagTokenOptimizer,
    RagHistoryService,
    RagConfigService,
    RagAuthGuard,
    RagRateLimitGuard,
  ],
})
export class RagChatbotModule {}
