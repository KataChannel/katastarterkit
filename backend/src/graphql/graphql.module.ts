import { Module } from '@nestjs/common';

import { UserResolver } from './resolvers/user.resolver';
import { PostResolver } from './resolvers/post.resolver';
import { CommentResolver } from './resolvers/comment.resolver';
import { GrokResolver } from './resolvers/grok.resolver';
import { TaskResolver } from './resolvers/task.resolver';

import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import { TaskService } from '../services/task.service';
import { TaskShareService } from '../services/task-share.service';
import { TaskCommentService } from '../services/task-comment.service';
import { TaskMediaService } from '../services/task-media.service';
import { NotificationService } from '../services/notification.service';
import { PubSubService } from '../services/pubsub.service';

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
    TaskResolver,
    
    // Services
    UserService,
    PostService,
    CommentService,
    TaskService,
    TaskShareService,
    TaskCommentService,
    TaskMediaService,
    NotificationService,
    PubSubService,
  ],
  exports: [
    UserService,
    PostService,
    CommentService,
    TaskService,
    TaskShareService,
    TaskCommentService,
    TaskMediaService,
    NotificationService,
    PubSubService,
  ],
})
export class GraphQLResolversModule {}
