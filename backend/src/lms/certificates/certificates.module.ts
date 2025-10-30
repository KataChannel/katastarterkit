import { Module } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { CertificatesResolver } from './certificates.resolver';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [CertificatesService, CertificatesResolver],
  exports: [CertificatesService],
})
export class CertificatesModule {}
