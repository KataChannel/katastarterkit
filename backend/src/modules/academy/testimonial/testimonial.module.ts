import { Module } from '@nestjs/common';
import { AcademyTestimonialService } from './testimonial.service';
import { AcademyTestimonialResolver } from './testimonial.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [AcademyTestimonialService, AcademyTestimonialResolver],
  exports: [AcademyTestimonialService],
})
export class AcademyTestimonialModule {}
