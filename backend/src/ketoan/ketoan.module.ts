import { Module } from '@nestjs/common';
import { InvoiceExportController } from './invoice-export.controller';
import { InvoiceExportService } from './invoice-export.service';
import { ProductNormalizationService } from './product-normalization.service';
import { ProductNormalizationResolver } from './product-normalization.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InvoiceExportController],
  providers: [
    InvoiceExportService,
    ProductNormalizationService,
    ProductNormalizationResolver,
  ],
  exports: [InvoiceExportService, ProductNormalizationService],
})
export class KetoAnModule {}