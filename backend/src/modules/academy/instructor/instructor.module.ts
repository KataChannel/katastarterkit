import { Module } from '@nestjs/common';
import { AcademyInstructorService } from './instructor.service';
import { AcademyInstructorResolver } from './instructor.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AcademyInstructorService, AcademyInstructorResolver],
  exports: [AcademyInstructorService],
})
export class AcademyInstructorModule {}
