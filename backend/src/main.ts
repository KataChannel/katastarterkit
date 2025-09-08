import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { EnvConfigService } from './config/env-config.service';
import * as dotenv from 'dotenv';
import { join } from 'path';
import * as express from 'express';

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });
dotenv.config({ path: join(__dirname, '../../.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Log environment configuration using ConfigService directly
  console.log('🔧 Environment Configuration:');
  console.log(`   NODE_ENV: ${configService.get('NODE_ENV', 'development')}`);
  console.log(`   PORT: ${configService.get('PORT', 4000)}`);
  console.log(`   FRONTEND_URL: ${configService.get('FRONTEND_URL', 'http://localhost:3000')}`);
  
  // Configure JSON body parser with larger limit for GraphQL
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));
  
  // Enable CORS
  app.enableCors({
    origin: configService.get('FRONTEND_URL', 'http://localhost:3000'),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prisma shutdown hook
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const port = configService.get('PORT', 4000);
  await app.listen(port);
  
  console.log(`🚀 Backend server running on http://localhost:${port}`);
  console.log(`📊 GraphQL playground available at http://localhost:${port}/graphql`);
}

bootstrap();
