import { Module } from '@nestjs/common';
import { AcademyCourseService } from './course.service';
import { AcademyCourseResolver } from './course.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AcademyCourseService, AcademyCourseResolver],
  exports: [AcademyCourseService],
})
export class AcademyCourseModule {}
