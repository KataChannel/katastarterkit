import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesResolver } from './quizzes.resolver';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [QuizzesService, QuizzesResolver],
  exports: [QuizzesService],
})
export class QuizzesModule {}
