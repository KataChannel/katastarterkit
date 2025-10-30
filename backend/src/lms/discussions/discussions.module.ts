import { Module } from '@nestjs/common';
import { DiscussionsService } from './discussions.service';
import { DiscussionsResolver } from './discussions.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [DiscussionsService, DiscussionsResolver],
  exports: [DiscussionsService],
})
export class DiscussionsModule {}
