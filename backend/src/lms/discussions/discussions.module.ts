import { Module } from '@nestjs/common';
import { DiscussionsService } from './discussions.service';
import { DiscussionsResolver } from './discussions.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DiscussionsService, DiscussionsResolver],
  exports: [DiscussionsService],
})
export class DiscussionsModule {}
