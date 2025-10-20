import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsResolver } from './enrollments.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EnrollmentsService, EnrollmentsResolver],
  exports: [EnrollmentsService],
})
export class EnrollmentsModule {}
