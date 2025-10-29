import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserService } from '../services/user.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule, // Provides JwtModule, AuthService for JwtAuthGuard
  ],
  providers: [
    ProjectService,
    ProjectResolver,
    UserService, // Needed by JwtAuthGuard
  ],
  exports: [ProjectService],
})
export class ProjectModule {}
