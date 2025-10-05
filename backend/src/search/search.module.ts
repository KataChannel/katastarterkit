import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ElasticsearchService } from './elasticsearch.service';
import { OramaService } from './orama.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SearchService, ElasticsearchService, OramaService],
  controllers: [SearchController],
  exports: [SearchService, ElasticsearchService, OramaService],
})
export class SearchModule {}