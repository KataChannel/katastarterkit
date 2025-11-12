import { Module } from '@nestjs/common';
import { SourceDocumentResolver } from './source-document.resolver';
import { SourceDocumentService } from './source-document.service';
import { SourceDocumentCategoryResolver } from './source-document-category.resolver';
import { SourceDocumentCategoryService } from './source-document-category.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MinioModule } from '../../minio/minio.module';
import { AiModule } from '../../ai/ai.module';

@Module({
  imports: [MinioModule, AiModule],
  providers: [
    PrismaService,
    SourceDocumentResolver,
    SourceDocumentService,
    SourceDocumentCategoryResolver,
    SourceDocumentCategoryService,
  ],
  exports: [SourceDocumentService, SourceDocumentCategoryService],
})
export class SourceDocumentModule {}
