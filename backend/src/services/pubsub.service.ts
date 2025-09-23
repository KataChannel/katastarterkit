import { Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class PubSubService {
  private readonly pubSub: any;

  constructor() {
    this.pubSub = new PubSub();
  }

  publish(event: string, payload: any): void {
    this.pubSub.publish(event, payload);
  }

  asyncIterator(event: string | string[]): any {
    return this.pubSub.asyncIterator(event);
  }

  // Helper methods for type safety
  publishPostCreated(post: any): void {
    this.publish('postCreated', { postCreated: post });
  }

  publishPostUpdated(post: any): void {
    this.publish('postUpdated', { postUpdated: post });
  }

  publishPostDeleted(postId: string): void {
    this.publish('postDeleted', { postDeleted: { id: postId } });
  }

  publishNewComment(comment: any, postId: string): void {
    this.publish('newComment', { 
      newComment: comment,
      postId: postId 
    });
  }

  publishUserRegistered(user: any): void {
    this.publish('userRegistered', { userRegistered: user });
  }

  // Async iterators for subscriptions
  getPostCreatedIterator() {
    return this.asyncIterator('postCreated');
  }

  getPostUpdatedIterator() {
    return this.asyncIterator('postUpdated');
  }

  getPostDeletedIterator() {
    return this.asyncIterator('postDeleted');
  }

  getNewCommentIterator() {
    return this.asyncIterator('newComment');
  }

  getUserRegisteredIterator() {
    return this.asyncIterator('userRegistered');
  }
}
