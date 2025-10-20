import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesResolver } from './files.resolver';
import { MinioModule } from '../../minio/minio.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [MinioModule, PrismaModule],
  providers: [FilesService, FilesResolver],
  exports: [FilesService],
})
export class FilesModule {}
