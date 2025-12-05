import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { MinioModule } from '../minio/minio.module';
import { FeatureExtractionService } from './services/feature-extraction.service';
import { TaskPrioritizationService } from './services/task-prioritization.service';
import { IntelligentSuggestionsService } from './services/intelligent-suggestions.service';
import { GeminiService } from './gemini.service';
import { AiController } from './ai.controller';
import { AiEcommerceController } from './ai-ecommerce.controller';

@Module({
  imports: [PrismaModule, MinioModule],
  controllers: [AiController, AiEcommerceController],
  providers: [
    FeatureExtractionService,
    TaskPrioritizationService,
    IntelligentSuggestionsService,
    GeminiService,
  ],
  exports: [
    FeatureExtractionService,
    TaskPrioritizationService,
    IntelligentSuggestionsService,
    GeminiService,
  ],
})
export class AiModule {}