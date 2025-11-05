import { Module, Global } from '@nestjs/common';
// TaskDataLoaderService removed - Task model deleted during cleanup
import { PrismaModule } from '../../prisma/prisma.module';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [],
  exports: [],
})
export class DataLoaderModule {}