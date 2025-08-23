import { Resolver, Query, Mutation, Args, Context, Subscription, ResolveField, Parent } from '@nestjs/graphql';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { PubSub } from 'graphql-subscriptions';
import { Comment as GraphQLComment } from '../models/comment.model';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';
import { UserRole } from '@prisma/client';
import { CreateCommentInput, UpdateCommentInput } from '../inputs/comment.input';
import { CommentService } from '../../services/comment.service';
import { UserService } from '../../services/user.service';
import { PostService } from '../../services/post.service';

const pubSub = new PubSub();

@Resolver(() => GraphQLComment)
export class CommentResolver {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  // Queries
  @Query(() => [GraphQLComment], { name: 'getCommentsByPost' })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  async getCommentsByPost(@Args('postId') postId: string): Promise<GraphQLComment[]> {
    return this.commentService.findByPost(postId);
  }

  @Query(() => GraphQLComment, { name: 'getCommentById' })
  async getCommentById(@Args('id') id: string): Promise<GraphQLComment> {
    return this.commentService.findById(id);
  }

  // Mutations
  @Mutation(() => GraphQLComment, { name: 'createComment' })
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Args('input') input: CreateCommentInput,
    @Context() context: any,
  ): Promise<GraphQLComment> {
    const userId = context.req.user.id;
    const comment = await this.commentService.create({ ...input, userId });
    
    // Publish new comment event for subscriptions
    pubSub.publish('newComment', { 
      newComment: comment,
      postId: input.postId 
    });
    
    return comment;
  }

  @Mutation(() => GraphQLComment, { name: 'updateComment' })
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Args('id') id: string,
    @Args('input') input: UpdateCommentInput,
    @Context() context: any,
  ): Promise<GraphQLComment> {
    const currentUser = context.req.user;
    const comment = await this.commentService.findById(id);
    
    // Only comment author or admin can update
    if (comment.userId !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized');
    }
    
    return this.commentService.update(id, input);
  }

  @Mutation(() => Boolean, { name: 'deleteComment' })
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Args('id') id: string,
    @Context() context: any,
  ): Promise<boolean> {
    const currentUser = context.req.user;
    const comment = await this.commentService.findById(id);
    
    // Only comment author or admin can delete
    if (comment.userId !== currentUser.id && currentUser.role !== UserRole.ADMIN) {
      throw new Error('Unauthorized');
    }
    
    await this.commentService.delete(id);
    return true;
  }

  // Field Resolvers
  @ResolveField(() => User)
  async user(@Parent() comment: GraphQLComment): Promise<User> {
    return this.userService.findById(comment.userId);
  }

  @ResolveField(() => Post)
  async post(@Parent() comment: GraphQLComment): Promise<Post> {
    return this.postService.findById(comment.postId);
  }

  @ResolveField(() => GraphQLComment, { nullable: true })
  async parent(@Parent() comment: GraphQLComment): Promise<GraphQLComment | null> {
    if (!comment.parentId) return null;
    return this.commentService.findById(comment.parentId);
  }

  @ResolveField(() => [GraphQLComment])
  async replies(@Parent() comment: GraphQLComment): Promise<GraphQLComment[]> {
    return this.commentService.findReplies(comment.id);
  }

  // Subscriptions
  @Subscription(() => GraphQLComment, { 
    name: 'newComment',
    filter: (payload, variables) => {
      // Filter by postId if provided
      return !variables.postId || payload.postId === variables.postId;
    }
  })
  newComment(@Args('postId', { nullable: true }) postId?: string) {
    return pubSub.asyncIterator('newComment');
  }
}
