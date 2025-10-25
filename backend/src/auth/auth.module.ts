import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { HttpModule } from '@nestjs/axios';

import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => {
        const expiresInConfig = configService.get<string | number>('JWT_EXPIRES_IN');
        const expiresIn = expiresInConfig !== undefined && expiresInConfig !== null ? expiresInConfig : '24h';
        return {
          secret: configService.get<string>('JWT_SECRET') || 'fallback-secret-key',
          signOptions: {
            expiresIn: expiresIn as any,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
