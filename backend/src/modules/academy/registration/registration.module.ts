import { Module } from '@nestjs/common';
import { AcademyRegistrationService } from './registration.service';
import { AcademyRegistrationResolver } from './registration.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [AcademyRegistrationService, AcademyRegistrationResolver],
  exports: [AcademyRegistrationService],
})
export class AcademyRegistrationModule {}
