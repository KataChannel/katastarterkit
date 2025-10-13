import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { CallCenterService } from '../services/callcenter.service';
import { CallCenterResolver } from '../graphql/resolvers/callcenter.resolver';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(), // Enable cron jobs
  ],
  providers: [CallCenterService, CallCenterResolver],
  exports: [CallCenterService],
})
export class CallCenterModule {}
