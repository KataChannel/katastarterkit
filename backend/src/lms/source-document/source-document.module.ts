import { Module } from '@nestjs/common';
import { SourceDocumentResolver } from './source-document.resolver';
import { SourceDocumentService } from './source-document.service';
import { SourceDocumentCategoryResolver } from './source-document-category.resolver';
import { SourceDocumentCategoryService } from './source-document-category.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MinioModule } from '../../minio/minio.module';
import { AiModule } from '../../ai/ai.module';
import { AuthModule } from '../../auth/auth.module';
import { UserService } from '../../services/user.service';

@Module({
  imports: [MinioModule, AiModule, AuthModule],
  providers: [
    PrismaService,
    SourceDocumentResolver,
    SourceDocumentService,
    SourceDocumentCategoryResolver,
    SourceDocumentCategoryService,
    UserService,
  ],
  exports: [SourceDocumentService, SourceDocumentCategoryService],
})
export class SourceDocumentModule {}
