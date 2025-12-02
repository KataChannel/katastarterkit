import { Module } from '@nestjs/common';
import { AcademyTestimonialService } from './testimonial.service';
import { AcademyTestimonialResolver } from './testimonial.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AcademyTestimonialService, AcademyTestimonialResolver],
  exports: [AcademyTestimonialService],
})
export class AcademyTestimonialModule {}
