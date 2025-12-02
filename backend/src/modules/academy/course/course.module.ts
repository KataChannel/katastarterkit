import { Module } from '@nestjs/common';
import { AcademyCourseService } from './course.service';
import { AcademyCourseResolver } from './course.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [AcademyCourseService, AcademyCourseResolver],
  exports: [AcademyCourseService],
})
export class AcademyCourseModule {}
