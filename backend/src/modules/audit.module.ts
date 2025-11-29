import { Module, Global } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { EnhancedAuditService } from '../services/enhanced-audit.service';
import { SmartAuditService } from '../services/smart-audit.service';
import { AuditOptimizationService } from '../services/audit-optimization.service';
import { AuditInterceptor } from '../interceptors/audit.interceptor';
import { AuditResolver } from '../graphql/resolvers/audit.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(), // Enable cron jobs for audit cleanup
  ],
  providers: [
    EnhancedAuditService, // Keep for backward compatibility
    SmartAuditService,    // New optimized service
    AuditOptimizationService, // Cleanup and optimization
    AuditInterceptor,
    AuditResolver,
  ],
  exports: [
    EnhancedAuditService, // Keep for backward compatibility
    SmartAuditService,    // Export new service
    AuditOptimizationService,
    AuditInterceptor,
  ],
})
export class AuditModule {}