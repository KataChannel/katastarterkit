import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating test data...');

  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'test@innerbright.com',
      username: 'testuser',
      password: 'hashed_password_here',
      firstName: 'Test',
      lastName: 'User',
      roleType: 'USER',
      isActive: true,
      isVerified: true,
    },
  });
  console.log('✅ Created user:', user.email);

  // Create auth method
  const authMethod = await prisma.authMethod.create({
    data: {
      userId: user.id,
      provider: 'LOCAL',
    },
  });
  console.log('✅ Created auth method for user');

  // Create a category
  const category = await prisma.category.create({
    data: {
      name: 'Technology',
      slug: 'technology',
      description: 'Tech articles and tutorials',
    },
  });
  console.log('✅ Created category:', category.name);

  // Create a tag
  const tag = await prisma.tag.create({
    data: {
      name: 'JavaScript',
      slug: 'javascript',
      createdById: user.id,
    },
  });
  console.log('✅ Created tag:', tag.name);

  // Create a post
  const post = await prisma.post.create({
    data: {
      title: 'Getting Started with Next.js',
      slug: 'getting-started-nextjs',
      excerpt: 'Learn the basics of Next.js framework',
      content: '<p>This is a sample blog post content...</p>',
      authorId: user.id,
      categoryId: category.id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      tags: {
        connect: [{ id: tag.id }],
      },
    },
  });
  console.log('✅ Created post:', post.title);

  // Create website settings
  await prisma.websiteSetting.create({
    data: {
      key: 'site_name',
      value: 'InnerBright',
      type: 'string',
      group: 'general',
    },
  });
  console.log('✅ Created website setting: site_name');

  console.log('\n🎉 Test data created successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
