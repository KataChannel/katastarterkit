import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const doc = await prisma.sourceDocument.findUnique({
      where: { id: '953fcfe3-c66f-4993-9f10-2a5d0bd1a7f6' },
      include: {
        category: true,
        user: true,
      }
    });

    if (!doc) {
      console.log('❌ Document not found');
      return;
    }

    console.log('📄 Document Info:');
    console.log('ID:', doc.id);
    console.log('Title:', doc.title);
    console.log('Type:', doc.type);
    console.log('Status:', doc.status);
    console.log('URL:', doc.url);
    console.log('FileName:', doc.fileName);
    console.log('MimeType:', doc.mimeType);
    console.log('FileSize:', doc.fileSize?.toString());
    console.log('Duration:', doc.duration);
    console.log('ThumbnailUrl:', doc.thumbnailUrl);
    console.log('User:', doc.user?.username);
    console.log('\n🔗 Full URL:');
    console.log(doc.url);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
