import { Module } from '@nestjs/common';
import { CourseCategoriesService } from './course-categories.service';
import { CourseCategoriesResolver } from './course-categories.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CourseCategoriesService, CourseCategoriesResolver],
  exports: [CourseCategoriesService],
})
export class CourseCategoriesModule {}
