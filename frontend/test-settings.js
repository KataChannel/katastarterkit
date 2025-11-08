const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSettings() {
  try {
    console.log('🔍 Checking WebsiteSetting table...\n');
    
    const settings = await prisma.websiteSetting.findMany({
      orderBy: { key: 'asc' }
    });
    
    console.log(`Found ${settings.length} settings:\n`);
    
    if (settings.length === 0) {
      console.log('⚠️  Database is empty! No settings found.');
      console.log('\nYou need to seed the database with initial settings.');
    } else {
      settings.forEach(setting => {
        console.log(`✓ ${setting.key}`);
        console.log(`  Value: ${setting.value}`);
        console.log(`  Type: ${setting.type}`);
        console.log(`  Group: ${setting.group}`);
        console.log('');
      });
    }
    
    // Count by group
    const groups = settings.reduce((acc, s) => {
      const group = s.group || 'ungrouped';
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📊 Settings by group:');
    Object.entries(groups).forEach(([group, count]) => {
      console.log(`  ${group}: ${count}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testSettings();
