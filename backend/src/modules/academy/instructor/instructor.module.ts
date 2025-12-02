import { Module } from '@nestjs/common';
import { AcademyInstructorService } from './instructor.service';
import { AcademyInstructorResolver } from './instructor.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [AcademyInstructorService, AcademyInstructorResolver],
  exports: [AcademyInstructorService],
})
export class AcademyInstructorModule {}
