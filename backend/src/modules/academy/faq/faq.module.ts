import { Module } from '@nestjs/common';
import { AcademyFAQService } from './faq.service';
import { AcademyFAQResolver } from './faq.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AcademyFAQService, AcademyFAQResolver],
  exports: [AcademyFAQService],
})
export class AcademyFAQModule {}
