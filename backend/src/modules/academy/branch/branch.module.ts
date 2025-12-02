import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchResolver } from './branch.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';
import { AuthModule } from '../../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [BranchService, BranchResolver],
  exports: [BranchService],
})
export class BranchModule {}
