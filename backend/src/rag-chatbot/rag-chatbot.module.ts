/**
 * RAG Chatbot Module - Rausach Domain
 * Module tích hợp RAG với Gemini AI cho hệ thống quản lý rau sạch
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from '../services/user.service';

// Services
import {
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
    // User service (needed for auth)
    UserService,
    
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
