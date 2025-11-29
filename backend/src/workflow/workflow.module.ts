import { Module } from '@nestjs/common';
import { WorkflowService } from './workflow.service';
import { EmployeeOnboardingService } from './employee-onboarding.service';
import { WorkflowResolver } from './workflow.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  providers: [
    WorkflowService,
    EmployeeOnboardingService,
    WorkflowResolver,
  ],
  exports: [
    WorkflowService,
    EmployeeOnboardingService,
  ],
})
export class WorkflowModule {}
