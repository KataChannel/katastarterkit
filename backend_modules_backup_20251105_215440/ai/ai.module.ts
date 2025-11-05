import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FeatureExtractionService } from './services/feature-extraction.service';
import { TaskPrioritizationService } from './services/task-prioritization.service';
import { IntelligentSuggestionsService } from './services/intelligent-suggestions.service';
import { AiController } from './ai.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AiController],
  providers: [
    FeatureExtractionService,
    TaskPrioritizationService,
    IntelligentSuggestionsService,
  ],
  exports: [
    FeatureExtractionService,
    TaskPrioritizationService,
    IntelligentSuggestionsService,
  ],
})
export class AiModule {}