import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Comment } from '@prisma/client';
import { CreateCommentInput, UpdateCommentInput } from '../graphql/inputs/comment.input';

// Type for Comment with relations
type CommentWithRelations = Comment & {
  user: any;
  post: any;
  parent?: any;
  replies?: any[];
};

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<CommentWithRelations> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        user: true,
        post: true,
        parent: true,
        replies: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }

    return comment;
  }

  async findByPost(postId: string): Promise<CommentWithRelations[]> {
    return this.prisma.comment.findMany({
      where: { 
        postId,
        parentId: null, // Only top-level comments
      },
      include: {
        user: true,
        post: true,
        replies: {
          include: {
            user: true,
            replies: {
              include: {
                user: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findReplies(parentId: string): Promise<CommentWithRelations[]> {
    return this.prisma.comment.findMany({
      where: { parentId },
      include: {
        user: true,
        post: true,
        replies: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async create(input: CreateCommentInput & { userId: string }): Promise<CommentWithRelations> {
    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: input.postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${input.postId} not found`);
    }

    // Verify parent comment exists if provided
    if (input.parentId) {
      const parentComment = await this.prisma.comment.findUnique({
        where: { id: input.parentId },
      });

      if (!parentComment) {
        throw new NotFoundException(`Parent comment with ID ${input.parentId} not found`);
      }

      // Ensure parent comment belongs to the same post
      if (parentComment.postId !== input.postId) {
        throw new NotFoundException('Parent comment does not belong to the specified post');
      }
    }

    const comment = await this.prisma.comment.create({
      data: input,
      include: {
        user: true,
        post: true,
        parent: true,
      },
    });

    return comment;
  }

  async update(id: string, input: UpdateCommentInput): Promise<CommentWithRelations> {
    await this.findById(id); // Check if comment exists

    const updatedComment = await this.prisma.comment.update({
      where: { id },
      data: input,
      include: {
        user: true,
        post: true,
        parent: true,
      },
    });

    return updatedComment;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id); // Check if comment exists

    // Delete comment and all its replies (cascade)
    await this.prisma.comment.delete({
      where: { id },
    });
  }

  async getCommentsCount(postId: string): Promise<number> {
    return this.prisma.comment.count({
      where: { postId },
    });
  }
}
