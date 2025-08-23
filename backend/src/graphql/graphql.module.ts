import { Module } from '@nestjs/common';

import { UserResolver } from './resolvers/user.resolver';
import { PostResolver } from './resolvers/post.resolver';
import { CommentResolver } from './resolvers/comment.resolver';
import { GrokResolver } from './resolvers/grok.resolver';

import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { GrokModule } from '../grok/grok.module';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    GrokModule,
    MinioModule,
  ],
  providers: [
    // Resolvers
    UserResolver,
    PostResolver,
    CommentResolver,
    GrokResolver,
    
    // Services
    UserService,
    PostService,
    CommentService,
  ],
  exports: [
    UserService,
    PostService,
    CommentService,
  ],
})
export class GraphQLResolversModule {}
