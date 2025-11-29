import { PrismaClient, SourceDocumentType } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  const userId = '98e0649a-62e5-4bb1-8b55-dc2f4fc9b960';
  const types = ['IMAGE'];
  
  console.log('\n🧪 Testing Prisma query with filter...\n');
  console.log('Input:', { types, userId });
  console.log('Type of types[0]:', typeof types[0]);
  console.log('SourceDocumentType enum:', SourceDocumentType);
  
  // Test 1: With string array
  console.log('\n--- Test 1: types as string array ---');
  const result1 = await prisma.sourceDocument.findMany({
    where: {
      type: { in: types as any },
      userId,
    },
    select: { id: true, type: true, title: true },
    take: 5,
  });
  console.log('Result:', result1.length, 'documents');
  
  // Test 2: With enum array
  console.log('\n--- Test 2: types as enum array ---');
  const result2 = await prisma.sourceDocument.findMany({
    where: {
      type: { in: types.map(t => t as SourceDocumentType) },
      userId,
    },
    select: { id: true, type: true, title: true },
    take: 5,
  });
  console.log('Result:', result2.length, 'documents');
  
  // Test 3: Direct enum value
  console.log('\n--- Test 3: Direct enum value ---');
  const result3 = await prisma.sourceDocument.findMany({
    where: {
      type: SourceDocumentType.IMAGE,
      userId,
    },
    select: { id: true, type: true, title: true },
    take: 5,
  });
  console.log('Result:', result3.length, 'documents');
  
  // Test 4: No userId filter
  console.log('\n--- Test 4: No userId filter (just IMAGE type) ---');
  const result4 = await prisma.sourceDocument.findMany({
    where: {
      type: { in: types as any },
    },
    select: { id: true, type: true, title: true, userId: true },
    take: 5,
  });
  console.log('Result:', result4.length, 'documents');
  result4.forEach(doc => {
    console.log(`  - ${doc.title} [${doc.type}] (user: ${doc.userId})`);
  });
  
  await prisma.$disconnect();
}

main().catch(console.error);
