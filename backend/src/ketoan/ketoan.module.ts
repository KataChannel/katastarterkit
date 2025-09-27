import { Module } from '@nestjs/common';
import { InvoiceExportController } from './invoice-export.controller';
import { InvoiceExportService } from './invoice-export.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [InvoiceExportController],
  providers: [InvoiceExportService],
  exports: [InvoiceExportService],
})
export class KetoAnModule {}