import { Module } from '@nestjs/common';
import { AcademyFAQService } from './faq.service';
import { AcademyFAQResolver } from './faq.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [AcademyFAQService, AcademyFAQResolver],
  exports: [AcademyFAQService],
})
export class AcademyFAQModule {}
