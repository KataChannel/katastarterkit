import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { HRService } from '../../services/hr.service';
import {
  EmployeeProfileResolver,
  OnboardingResolver,
  OffboardingResolver,
  EmploymentHistoryResolver,
  HRStatisticsResolver,
} from '../resolvers/hr';

@Module({
  providers: [
    // Services
    PrismaService,
    HRService,
    
    // Resolvers
    EmployeeProfileResolver,
    OnboardingResolver,
    OffboardingResolver,
    EmploymentHistoryResolver,
    HRStatisticsResolver,
  ],
  exports: [HRService],
})
export class HRModule {}
