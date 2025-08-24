import { Resolver, Query, Mutation, Args, Context, Subscription, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Task } from '../models/task.model';
import { TaskMedia } from '../models/task-media.model';
import { TaskShare } from '../models/task-share.model';
import { TaskComment } from '../models/task-comment.model';
import { Notification } from '../models/notification.model';
import { User } from '../models/user.model';
import { CreateTaskInput, UpdateTaskInput, TaskFilterInput } from '../inputs/task.input';
import { ShareTaskInput, UpdateTaskShareInput } from '../inputs/task-share.input';
import { CreateTaskCommentInput, UpdateTaskCommentInput } from '../inputs/task-comment.input';
import { TaskService } from '../../services/task.service';
import { TaskShareService } from '../../services/task-share.service';
import { TaskCommentService } from '../../services/task-comment.service';
import { TaskMediaService } from '../../services/task-media.service';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { PubSubService } from '../../services/pubsub.service';

@Resolver(() => Task)
export class TaskResolver {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskShareService: TaskShareService,
    private readonly taskCommentService: TaskCommentService,
    private readonly taskMediaService: TaskMediaService,
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
    private readonly pubSubService: PubSubService,
  ) {}

  // Queries
  @Query(() => [Task], { name: 'getTasks' })
  @UseGuards(JwtAuthGuard)
  async getTasks(
    @Context() context: any,
    @Args('filters', { nullable: true }) filters?: TaskFilterInput,
  ): Promise<any[]> {
    const userId = context.req.user.sub;
    return this.taskService.findByUserId(userId, filters);
  }

  @Query(() => Task, { name: 'getTaskById' })
  @UseGuards(JwtAuthGuard)
  async getTaskById(
    @Args('id') id: string,
    @Context() context: any,
  ): Promise<any> {
    const userId = context.req.user.sub;
    return this.taskService.findById(id, userId);
  }

  @Query(() => [Task], { name: 'getSharedTasks' })
  @UseGuards(JwtAuthGuard)
  async getSharedTasks(
    @Context() context: any,
    @Args('filters', { nullable: true }) filters?: TaskFilterInput,
  ): Promise<any[]> {
    const userId = context.req.user.sub;
    return this.taskService.findSharedTasks(userId, filters);
  }

  // Mutations
  @Mutation(() => Task, { name: 'createTask' })
  @UseGuards(JwtAuthGuard)
  async createTask(
    @Args('input') input: CreateTaskInput,
    @Context() context: any,
  ): Promise<any> {
    const userId = context.req.user.sub;
    const task = await this.taskService.create(input, userId);
    
    // Publish task created event
    await this.pubSubService.publish('taskCreated', { taskCreated: task });
    
    return task;
  }

  @Mutation(() => Task, { name: 'updateTask' })
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Args('input') input: UpdateTaskInput,
    @Context() context: any,
  ): Promise<any> {
    const userId = context.req.user.sub;
    const task = await this.taskService.update(input, userId);
    
    // Publish task updated event
    await this.pubSubService.publish('taskUpdated', { taskUpdated: task });
    
    // Create notification if task is completed
    if (input.status === 'COMPLETED') {
      await this.notificationService.createTaskCompletedNotification(task.id, userId);
    }
    
    return task;
  }

  @Mutation(() => Boolean, { name: 'deleteTask' })
  @UseGuards(JwtAuthGuard)
  async deleteTask(
    @Args('id') id: string,
    @Context() context: any,
  ): Promise<boolean> {
    const userId = context.req.user.sub;
    await this.taskService.delete(id, userId);
    
    // Publish task deleted event
    await this.pubSubService.publish('taskDeleted', { taskDeleted: { id } });
    
    return true;
  }

  @Mutation(() => TaskShare, { name: 'shareTask' })
  @UseGuards(JwtAuthGuard)
  async shareTask(
    @Args('input') input: ShareTaskInput,
    @Context() context: any,
  ): Promise<any> {
    const userId = context.req.user.sub;
    const share = await this.taskShareService.create(input, userId);
    
    // Create notification for shared user
    await this.notificationService.createTaskAssignedNotification(
      input.taskId,
      input.sharedWithId,
    );
    
    // Publish task shared event
    await this.pubSubService.publish('taskShared', { taskShared: share });
    
    return share;
  }

  @Mutation(() => TaskComment, { name: 'createTaskComment' })
  @UseGuards(JwtAuthGuard)
  async createTaskComment(
    @Args('input') input: CreateTaskCommentInput,
    @Context() context: any,
  ): Promise<any> {
    const userId = context.req.user.sub;
    const comment = await this.taskCommentService.create(input, userId);
    
    // Create notification for task owner and collaborators
    await this.notificationService.createTaskCommentNotification(
      input.taskId,
      userId,
    );
    
    // Publish comment created event
    await this.pubSubService.publish('taskCommentCreated', { taskCommentCreated: comment });
    
    return comment;
  }

  // Subscriptions
  @Subscription(() => Task, { name: 'taskCreated' })
  taskCreated() {
    return this.pubSubService.asyncIterator('taskCreated');
  }

  @Subscription(() => Task, { name: 'taskUpdated' })
  taskUpdated() {
    return this.pubSubService.asyncIterator('taskUpdated');
  }

  @Subscription(() => TaskComment, { name: 'taskCommentCreated' })
  taskCommentCreated() {
    return this.pubSubService.asyncIterator('taskCommentCreated');
  }

  // Field Resolvers
  @ResolveField(() => User)
  async user(@Parent() task: Task): Promise<User> {
    return this.userService.findById(task.userId);
  }

  @ResolveField(() => [TaskMedia])
  async attachments(@Parent() task: Task): Promise<any[]> {
    return this.taskMediaService.findByTaskId(task.id);
  }

  @ResolveField(() => [TaskShare])
  async shares(@Parent() task: Task): Promise<any[]> {
    return this.taskShareService.findByTaskId(task.id);
  }

  @ResolveField(() => [TaskComment])
  async comments(@Parent() task: Task): Promise<any[]> {
    return this.taskCommentService.findByTaskId(task.id);
  }
}
