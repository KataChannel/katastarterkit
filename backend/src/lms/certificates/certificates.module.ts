import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesResolver } from './certificates.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CertificatesService, CertificatesResolver],
  exports: [CertificatesService],
})
export class CertificatesModule {}
