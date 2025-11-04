import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';
import { AICourseGeneratorService } from './ai-course-generator.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';
import { UserService } from '../../services/user.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule, // Import AuthModule for JwtAuthGuard (provides JwtModule + UserService)
  ],
  providers: [CoursesService, CoursesResolver, AICourseGeneratorService, UserService],
  exports: [CoursesService, AICourseGeneratorService],
})
export class CoursesModule {}
