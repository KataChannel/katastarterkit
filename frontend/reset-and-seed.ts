import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing existing data...');
  
  // Delete in reverse dependency order
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.websiteSetting.deleteMany();
  await prisma.authMethod.deleteMany();
  await prisma.user.deleteMany();
  
  console.log('✅ Data cleared\n');
  console.log('🌱 Creating test data...');

  // Create a test user
  const user = await prisma.user.create({
    data: {
      email: 'admin@innerbright.com',
      username: 'admin',
      password: '$2b$10$XYZ...', // Hashed password
      firstName: 'Admin',
      lastName: 'User',
      roleType: 'ADMIN',
      isActive: true,
      isVerified: true,
    },
  });
  console.log('✅ Created user:', user.email);

  // Create auth method
  await prisma.authMethod.create({
    data: {
      userId: user.id,
      provider: 'LOCAL',
    },
  });
  console.log('✅ Created auth method');

  // Create categories
  const techCategory = await prisma.category.create({
    data: {
      name: 'Technology',
      slug: 'technology',
      description: 'Tech articles and tutorials',
    },
  });
  
  const businessCategory = await prisma.category.create({
    data: {
      name: 'Business',
      slug: 'business',
      description: 'Business insights',
    },
  });
  console.log('✅ Created 2 categories');

  // Create tags
  const jsTag = await prisma.tag.create({
    data: {
      name: 'JavaScript',
      slug: 'javascript',
      createdById: user.id,
    },
  });
  
  const reactTag = await prisma.tag.create({
    data: {
      name: 'React',
      slug: 'react',
      createdById: user.id,
    },
  });
  console.log('✅ Created 2 tags');

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: 'Getting Started with Next.js 15',
      slug: 'getting-started-nextjs-15',
      excerpt: 'Learn the latest features of Next.js 15',
      content: '<p>Next.js 15 brings exciting new features...</p>',
      authorId: user.id,
      categoryId: techCategory.id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
      viewCount: 150,
      tags: {
        connect: [{ id: jsTag.id }, { id: reactTag.id }],
      },
    },
  });
  
  const post2 = await prisma.post.create({
    data: {
      title: 'React 19 New Features',
      slug: 'react-19-features',
      excerpt: 'Explore what is new in React 19',
      content: '<p>React 19 introduces amazing capabilities...</p>',
      authorId: user.id,
      categoryId: techCategory.id,
      status: 'PUBLISHED',
      publishedAt: new Date(Date.now() - 86400000), // Yesterday
      viewCount: 230,
      tags: {
        connect: [{ id: reactTag.id }],
      },
    },
  });
  console.log('✅ Created 2 posts');

  // Create website settings
  await prisma.websiteSetting.createMany({
    data: [
      {
        key: 'site_name',
        value: 'InnerBright',
        type: 'string',
        group: 'general',
      },
      {
        key: 'site_description',
        value: 'Personal Development & NLP Training Center',
        type: 'string',
        group: 'general',
      },
      {
        key: 'posts_per_page',
        value: '10',
        type: 'number',
        group: 'blog',
      },
    ],
  });
  console.log('✅ Created 3 website settings');

  console.log('\n🎉 Test data created successfully!');
  console.log('\n📊 Summary:');
  console.log(`   Users: ${await prisma.user.count()}`);
  console.log(`   Categories: ${await prisma.category.count()}`);
  console.log(`   Tags: ${await prisma.tag.count()}`);
  console.log(`   Posts: ${await prisma.post.count()}`);
  console.log(`   Settings: ${await prisma.websiteSetting.count()}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
