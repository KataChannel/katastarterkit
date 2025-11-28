import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Count total documents
    const total = await prisma.sourceDocument.count();
    console.log('📊 Total Source Documents:', total);

    // Get all documents with user info
    const docs = await prisma.sourceDocument.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        userId: true,
        user: {
          select: {
            username: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    console.log('\n📄 Recent documents:');
    docs.forEach(doc => {
      console.log(`- ${doc.title} (${doc.status}) by ${doc.user?.username || 'N/A'} [userId: ${doc.userId}]`);
    });

    // Count by user
    const byUser = await prisma.sourceDocument.groupBy({
      by: ['userId'],
      _count: true,
    });
    
    console.log('\n👥 Documents per user:');
    for (const item of byUser) {
      const user = await prisma.user.findUnique({
        where: { id: item.userId },
        select: { username: true, email: true }
      });
      console.log(`- ${user?.username || 'Unknown'}: ${item._count} documents`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
