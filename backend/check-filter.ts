import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userId = '98e0649a-62e5-4bb1-8b55-dc2f4fc9b960';
  
  console.log('\n🔍 Checking filter with type IMAGE and userId...\n');
  
  // Count with filter
  const withFilter = await prisma.sourceDocument.count({
    where: {
      type: 'IMAGE',
      userId: userId,
    },
  });
  
  console.log('Documents with type=IMAGE and userId:', withFilter);
  
  // Get actual documents
  const docs = await prisma.sourceDocument.findMany({
    where: {
      type: 'IMAGE',
      userId: userId,
    },
    select: { id: true, title: true, type: true },
    take: 15,
  });
  
  console.log('\nFirst 15 IMAGE documents:');
  docs.forEach((doc, i) => {
    console.log(`  ${i + 1}. [${doc.type}] ${doc.title}`);
  });
  
  // Check without userId filter
  const allImages = await prisma.sourceDocument.count({
    where: { type: 'IMAGE' },
  });
  
  console.log(`\nTotal IMAGE documents (all users): ${allImages}`);
  
  // Check this user's documents
  const userDocs = await prisma.sourceDocument.groupBy({
    by: ['type'],
    where: { userId },
    _count: true,
  });
  
  console.log(`\nThis user's documents by type:`);
  userDocs.forEach(group => {
    console.log(`  ${group.type}: ${group._count}`);
  });
  
  await prisma.$disconnect();
}

main().catch(console.error);
