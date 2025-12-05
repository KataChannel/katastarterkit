/**
 * RAG Chatbot Module - Rausach Domain
 * Module tích hợp RAG với Gemini AI cho hệ thống quản lý rau sạch
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

// Services
import {
  RagChatbotService,
  RagContextService,
  RagIntentService,
  RagGeminiService,
  RagTokenOptimizer,
} from './services';

// Controller & Resolver
import { RagChatbotController } from './rag-chatbot.controller';
import { RagChatbotResolver } from './rag-chatbot.resolver';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
  ],
  controllers: [RagChatbotController],
  providers: [
    // Core services
    RagContextService,
    RagIntentService,
    RagGeminiService,
    RagTokenOptimizer,  // Token optimization service
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
  ],
})
export class RagChatbotModule {}
