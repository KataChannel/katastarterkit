import { Module } from '@nestjs/common';
import { BranchService } from './branch.service';
import { BranchResolver } from './branch.resolver';
import { PrismaModule } from '../../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BranchService, BranchResolver],
  exports: [BranchService],
})
export class BranchModule {}
