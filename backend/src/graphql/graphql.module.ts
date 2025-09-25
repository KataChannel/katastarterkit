import { Module } from '@nestjs/common';

import { UserResolver } from './resolvers/user.resolver';
import { PostResolver } from './resolvers/post.resolver';
import { CommentResolver } from './resolvers/comment.resolver';
import { GrokResolver } from './resolvers/grok.resolver';
import { TaskResolver } from './resolvers/task.resolver';
import { PageResolver } from './resolvers/page.resolver';

import { UserService } from '../services/user.service';
import { PostService } from '../services/post.service';
import { CommentService } from '../services/comment.service';
import { TaskService } from '../services/task.service';
import { TaskShareService } from '../services/task-share.service';
import { TaskCommentService } from '../services/task-comment.service';
import { TaskMediaService } from '../services/task-media.service';
import { NotificationService } from '../services/notification.service';
import { OtpService } from '../services/otp.service';
import { PubSubService } from '../services/pubsub.service';
import { PageService } from '../services/page.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { GrokModule } from '../grok/grok.module';
import { MinioModule } from '../minio/minio.module';
import { JSONScalar } from './scalars/json.scalar';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    GrokModule,
    MinioModule,
  ],
  providers: [
    // Scalars
    JSONScalar,
    
    // Resolvers
    UserResolver,
    PostResolver,
    CommentResolver,
    GrokResolver,
    TaskResolver,
    PageResolver,
    
    // Services
    UserService,
    PostService,
    CommentService,
    TaskService,
    TaskShareService,
    TaskCommentService,
    TaskMediaService,
    NotificationService,
    OtpService,
    PubSubService,
    PageService,
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
    PageService,
  ],
})
export class GraphQLResolversModule {}
