import { PrismaClient, UserRoleType, PostStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.upsert({
    where: { email: 'admin@katacore.dev' },
    update: {},
    create: {
      email: 'admin@katacore.dev',
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      password: adminPassword,
      roleType: 'ADMIN',
      isActive: true,
    },
  });

  // Create test users
  const userPassword = await bcrypt.hash('user123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'user@katacore.dev' },
    update: {},
    create: {
      email: 'user@katacore.dev',
      username: 'testuser',
      password: userPassword,
      firstName: 'Test',
      lastName: 'User',
      roleType: 'USER',
    },
  });

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: {
        name: 'Next.js',
        slug: 'nextjs',
        color: '#000000',
        createdBy: adminUser.id,
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'nestjs' },
      update: {},
      create: {
        name: 'NestJS',
        slug: 'nestjs',
        color: '#ea2845',
        createdBy: adminUser.id,
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'graphql' },
      update: {},
      create: {
        name: 'GraphQL',
        slug: 'graphql',
        color: '#e10098',
        createdBy: adminUser.id,
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'prisma' },
      update: {},
      create: {
        name: 'Prisma',
        slug: 'prisma',
        color: '#2d3748',
        createdBy: adminUser.id,
      },
    }),
  ]);

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Welcome to KataCore',
        content: `# Welcome to KataCore

KataCore is a modern fullstack starter kit built with the latest technologies.

## Features

- **Next.js 15** with React 19 and TypeScript
- **NestJS 11** with GraphQL
- **Prisma ORM** with PostgreSQL
- **Redis** for caching
- **MinIO** for object storage
- **TailwindCSS v4** for styling
- **Docker** for containerization

This starter kit provides everything you need to build scalable, production-ready applications.`,
        excerpt: 'Learn about KataCore, the modern fullstack starter kit.',
        slug: 'welcome-to-katacore',
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: adminUser.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Getting Started with GraphQL',
        content: `# Getting Started with GraphQL

GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.

## Why GraphQL?

1. **Single Endpoint**: All your data needs through one URL
2. **Type Safety**: Strong type system
3. **Efficient**: Request exactly what you need
4. **Real-time**: Built-in subscription support

## Basic Query Example

\`\`\`graphql
query GetPosts {
  getPosts {
    items {
      id
      title
      author {
        username
      }
    }
    meta {
      total
      page
      totalPages
    }
  }
}
\`\`\`

This query will fetch posts with their titles and author usernames.`,
        excerpt: 'Learn the basics of GraphQL and how to use it effectively.',
        slug: 'getting-started-with-graphql',
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        authorId: testUser.id,
      },
    }),
    prisma.post.create({
      data: {
        title: 'Building Scalable Applications with NestJS',
        content: `# Building Scalable Applications with NestJS

NestJS is a framework for building efficient, reliable and scalable server-side applications.

## Key Features

- **Modular Architecture**: Organize your code with modules
- **Dependency Injection**: Built-in IoC container
- **GraphQL Support**: First-class GraphQL support
- **Testing**: Comprehensive testing utilities

## Example Module

\`\`\`typescript
@Module({
  imports: [DatabaseModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
\`\`\``,
        excerpt: 'Discover how to build scalable applications using NestJS framework.',
        slug: 'building-scalable-applications-with-nestjs',
        status: PostStatus.DRAFT,
        authorId: adminUser.id,
      },
    }),
  ]);

  // Add tags to posts
  await Promise.all([
    prisma.postTag.create({
      data: {
        postId: posts[0].id,
        tagId: tags[0].id, // Next.js
      },
    }),
    prisma.postTag.create({
      data: {
        postId: posts[0].id,
        tagId: tags[1].id, // NestJS
      },
    }),
    prisma.postTag.create({
      data: {
        postId: posts[1].id,
        tagId: tags[2].id, // GraphQL
      },
    }),
    prisma.postTag.create({
      data: {
        postId: posts[2].id,
        tagId: tags[1].id, // NestJS
      },
    }),
  ]);

  // Create sample comments
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great introduction to KataCore! Looking forward to using it.',
        postId: posts[0].id,
        userId: testUser.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Very helpful GraphQL tutorial. Thanks for sharing!',
        postId: posts[1].id,
        userId: adminUser.id,
      },
    }),
  ]);

  // Create sample likes
  await Promise.all([
    prisma.like.create({
      data: {
        postId: posts[0].id,
        userId: testUser.id,
      },
    }),
    prisma.like.create({
      data: {
        postId: posts[1].id,
        userId: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Seed completed successfully!');
  console.log(`👤 Admin user: admin@katacore.dev / admin123`);
  console.log(`👤 Test user: user@katacore.dev / user123`);
  console.log(`📝 Created ${posts.length} posts`);
  console.log(`🏷️ Created ${tags.length} tags`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
