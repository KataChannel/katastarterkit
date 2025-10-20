import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsResolver } from './reviews.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ReviewsService, ReviewsResolver],
  exports: [ReviewsService],
})
export class ReviewsModule {}
