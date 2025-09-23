import { Resolver, Query, Mutation, Args, Context, Subscription, ResolveField, Parent, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RateLimitGuard } from '../../common/guards/rate-limit.guard';
import { InputSanitizationInterceptor } from '../../common/interceptors/input-sanitization.interceptor';
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
import { TaskDataLoaderService } from '../../common/data-loaders/task-data-loader.service';
import { CacheInvalidationService } from '../../common/services/cache-invalidation.service';

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
    private readonly taskDataLoaderService: TaskDataLoaderService,
    private readonly cacheInvalidationService: CacheInvalidationService,
  ) {}

  // Queries
  @Query(() => [Task], { name: 'getTasks' })
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  async getTasks(
    @Context() context: any,
    @Args('filters', { nullable: true }) filters?: TaskFilterInput,
  ): Promise<any[]> {
    const userId = context.req.user.id;
    return this.taskService.findByUserId(userId, filters);
  }

  @Query(() => Task, { name: 'getTaskById' })
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  async getTaskById(
    @Args('id', { type: () => ID }) id: string,
    @Context() context: any,
  ): Promise<any> {
    const userId = context.req.user.id;
    return this.taskService.findById(id, userId);
  }

  @Query(() => [Task], { name: 'getSharedTasks' })
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  async getSharedTasks(
    @Context() context: any,
    @Args('filters', { nullable: true }) filters?: TaskFilterInput,
  ): Promise<any[]> {
    const userId = context.req.user.id;
    return this.taskService.findSharedTasks(userId, filters);
  }

  // Mutations
  @Mutation(() => Task, { name: 'createTask' })
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  async createTask(
    @Args('input') input: CreateTaskInput,
    @Context() context: any,
  ): Promise<any> {
    const userId = context.req.user.id; // Changed from .sub to .id
    const task = await this.taskService.create(input, userId);
    
    // Publish task created event
    await this.pubSubService.publish('taskCreated', { taskCreated: task });
    
    // Smart cache invalidation
    await this.cacheInvalidationService.invalidateTaskCache(task.id, userId);
    
    return task;
  }

  @Mutation(() => Task, { name: 'updateTask' })
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  async updateTask(
    @Args('input') input: UpdateTaskInput,
    @Context() context: any,
  ): Promise<any> {
    const userId = context.req.user.id;
    const task = await this.taskService.update(input, userId);
    
    // Publish task updated event
    await this.pubSubService.publish('taskUpdated', { taskUpdated: task });
    
    // Create notification if task is completed
    if (input.status === 'COMPLETED') {
      await this.notificationService.createTaskCompletedNotification(task.id, userId);
    }
    
    // Smart cache invalidation
    await this.cacheInvalidationService.invalidateTaskCache(task.id, userId);
    
    return task;
  }

  @Mutation(() => Boolean, { name: 'deleteTask' })
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  async deleteTask(
    @Args('id') id: string,
    @Context() context: any,
  ): Promise<boolean> {
    const userId = context.req.user.id;
    await this.taskService.delete(id, userId);
    
    // Publish task deleted event
    await this.pubSubService.publish('taskDeleted', { taskDeleted: { id } });
    
    // Smart cache invalidation
    await this.cacheInvalidationService.invalidateTaskCache(id, userId);
    
    return true;
  }

  @Mutation(() => TaskShare, { name: 'shareTask' })
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  async shareTask(
    @Args('input') input: ShareTaskInput,
    @Context() context: any,
  ): Promise<any> {
    const userId = context.req.user.id;
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
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  async createTaskComment(
    @Args('input') input: CreateTaskCommentInput,
    @Context() context: any,
  ): Promise<any> {
    const userId = context.req.user.id;
    const comment = await this.taskCommentService.create(input, userId);
    
    // Create notification for task owner and collaborators
    await this.notificationService.createTaskCommentNotification(
      input.taskId,
      userId,
    );
    
    // Publish comment created event
    await this.pubSubService.publish('taskCommentCreated', { taskCommentCreated: comment });
    
    // Smart cache invalidation for comments
    await this.cacheInvalidationService.invalidateCommentCache(input.taskId, userId);
    
    return comment;
  }

  @Mutation(() => Task, { name: 'createSubtask' })
  @UseGuards(JwtAuthGuard, RateLimitGuard)
  async createSubtask(
    @Args('parentId') parentId: string,
    @Args('input') input: CreateTaskInput,
    @Context() context: any,
  ): Promise<any> {
    const userId = context.req.user.id;
    const subtask = await this.taskService.createSubtask(parentId, input, userId);
    
    // Smart cache invalidation for parent task
    await this.cacheInvalidationService.invalidateTaskCache(parentId, userId);
    await this.cacheInvalidationService.invalidateTaskCache(subtask.id, userId);
    
    return subtask;
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
  async author(@Parent() task: Task): Promise<User> {
    // Use DataLoader to prevent N+1 queries
    return this.taskDataLoaderService.loadUser(task.userId);
  }

  @ResolveField(() => Number)
  async progress(
    @Parent() task: Task,
    @Context() context: any,
  ): Promise<number> {
    const userId = context.req.user.id;
    const progressData = await this.taskService.getTaskProgress(task.id, userId);
    return progressData.progressPercentage;
  }

  @ResolveField(() => [TaskMedia])
  async media(@Parent() task: Task): Promise<any[]> {
    // Use DataLoader to prevent N+1 queries
    return this.taskDataLoaderService.loadMedia(task.id);
  }

  @ResolveField(() => [TaskShare])
  async shares(@Parent() task: Task): Promise<any[]> {
    return this.taskShareService.findByTaskId(task.id);
  }

  @ResolveField(() => [TaskComment])
  async comments(@Parent() task: Task): Promise<any[]> {
    // Use DataLoader to prevent N+1 queries
    return this.taskDataLoaderService.loadComments(task.id);
  }

  @ResolveField(() => Number)
  async commentCount(@Parent() task: Task): Promise<number> {
    const counts = await this.taskDataLoaderService.loadTaskCounts(task.id);
    return counts.comments;
  }

  @ResolveField(() => Number)
  async mediaCount(@Parent() task: Task): Promise<number> {
    const counts = await this.taskDataLoaderService.loadTaskCounts(task.id);
    return counts.media;
  }

  @ResolveField(() => Number)
  async subtaskCount(@Parent() task: Task): Promise<number> {
    const counts = await this.taskDataLoaderService.loadTaskCounts(task.id);
    return counts.subtasks;
  }

  @ResolveField(() => [Task])
  async subtasks(
    @Parent() task: Task,
    @Context() context: any,
  ): Promise<any[]> {
    const userId = context.req.user.id;
    return this.taskService.findSubtasks(task.id, userId);
  }

  @ResolveField(() => Task, { nullable: true })
  async parent(
    @Parent() task: Task,
    @Context() context: any,
  ): Promise<any> {
    if (!task.parentId) return null;
    const userId = context.req.user.id;
    return this.taskService.findById(task.parentId, userId);
  }

  // TaskComment field resolvers
  @ResolveField(() => User)
  async commentAuthor(@Parent() comment: TaskComment): Promise<User> {
    // Use DataLoader to prevent N+1 queries for comment authors
    return this.taskDataLoaderService.loadUser(comment.userId);
  }

  @ResolveField(() => TaskComment, { nullable: true })
  async commentParent(@Parent() comment: TaskComment): Promise<any> {
    if (!comment.parentId) return null;
    return this.taskCommentService.findById(comment.parentId);
  }

  @ResolveField(() => [TaskComment])
  async commentReplies(@Parent() comment: TaskComment): Promise<any[]> {
    return this.taskCommentService.findReplies(comment.id);
  }
}
