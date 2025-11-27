import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateAnalyticsPublic() {
  try {
    console.log('🔍 Checking current ANALYTICS settings...');
    
    const before = await prisma.websiteSetting.findMany({
      where: { category: 'ANALYTICS' },
      select: { key: true, value: true, isPublic: true, isActive: true }
    });
    
    console.log('\n📊 Before update:');
    console.table(before);
    
    console.log('\n🔄 Updating ANALYTICS settings to isPublic: true...');
    
    const result = await prisma.websiteSetting.updateMany({
      where: { category: 'ANALYTICS' },
      data: { isPublic: true }
    });
    
    console.log(`✅ Updated ${result.count} settings`);
    
    const after = await prisma.websiteSetting.findMany({
      where: { category: 'ANALYTICS' },
      select: { key: true, value: true, isPublic: true, isActive: true }
    });
    
    console.log('\n📊 After update:');
    console.table(after);
    
    console.log('\n✨ Done! ANALYTICS settings are now public.');
    console.log('🧪 Test with: curl -X POST http://localhost:12001/graphql -d \'{"query":"query{publicWebsiteSettings(category:ANALYTICS){key value}}"}\' | jq .');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAnalyticsPublic();
