import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const filter = {
    types: ["IMAGE"],
    categoryId: "06f27bd8-4b0f-4fe4-ba4f-3d3072d66577",
    userId: "98e0649a-62e5-4bb1-8b55-dc2f4fc9b960"
  };
  
  console.log('\n🔍 Testing filter conditions:\n', JSON.stringify(filter, null, 2));
  
  // Test 1: All conditions
  console.log('\n--- Test 1: All conditions (types + categoryId + userId) ---');
  const result1 = await prisma.sourceDocument.findMany({
    where: {
      type: { in: filter.types as any },
      categoryId: filter.categoryId,
      userId: filter.userId,
    },
    select: { id: true, title: true, type: true, categoryId: true, userId: true },
  });
  console.log('Result:', result1.length, 'documents');
  result1.forEach(doc => {
    console.log(`  - ${doc.title} [${doc.type}] cat:${doc.categoryId?.slice(0,8)}... user:${doc.userId?.slice(0,8)}...`);
  });
  
  // Test 2: Without categoryId
  console.log('\n--- Test 2: types + userId (no categoryId) ---');
  const result2 = await prisma.sourceDocument.findMany({
    where: {
      type: { in: filter.types as any },
      userId: filter.userId,
    },
    select: { id: true, title: true, type: true, categoryId: true },
  });
  console.log('Result:', result2.length, 'documents');
  
  // Test 3: Only types
  console.log('\n--- Test 3: Only types ---');
  const result3 = await prisma.sourceDocument.findMany({
    where: {
      type: { in: filter.types as any },
    },
    select: { id: true, title: true, type: true, userId: true },
    take: 5,
  });
  console.log('Result:', result3.length, 'documents');
  result3.forEach(doc => {
    console.log(`  - ${doc.title} [${doc.type}] user:${doc.userId?.slice(0,8)}...`);
  });
  
  // Test 4: Check category exists
  console.log('\n--- Test 4: Check if category exists ---');
  const category = await prisma.sourceDocumentCategory.findUnique({
    where: { id: filter.categoryId },
    select: { id: true, name: true },
  });
  console.log('Category:', category ? `${category.name} (${category.id})` : 'NOT FOUND');
  
  // Test 5: Check user's documents
  console.log('\n--- Test 5: User documents by type ---');
  const userDocs = await prisma.sourceDocument.groupBy({
    by: ['type'],
    where: { userId: filter.userId },
    _count: true,
  });
  console.log('User document types:');
  userDocs.forEach(group => {
    console.log(`  ${group.type}: ${group._count}`);
  });
  
  await prisma.$disconnect();
}

main().catch(console.error);
