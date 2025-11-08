const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCategorization() {
  try {
    const settings = await prisma.websiteSetting.findMany({
      orderBy: { key: 'asc' }
    });
    
    console.log(`\n🔍 Testing categorization for ${settings.length} settings:\n`);
    
    const categories = {};
    
    settings.forEach(setting => {
      let category = 'GENERAL';
      const key = setting.key;
      
      if (key.startsWith('auth_')) {
        category = 'AUTH';
      } else {
        const keyPrefix = key.split('.')[0];
        
        switch (keyPrefix) {
          case 'header':
            category = 'HEADER';
            break;
          case 'footer':
            category = 'FOOTER';
            break;
          case 'contact':
            category = 'CONTACT';
            break;
          case 'social':
            category = 'SOCIAL';
            break;
          case 'seo':
            category = 'SEO';
            break;
          case 'support_chat':
            category = 'SUPPORT_CHAT';
            break;
          case 'site':
          case 'appearance':
            category = 'GENERAL';
            break;
          default:
            category = 'GENERAL';
        }
      }
      
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(setting.key);
    });
    
    console.log('📊 Settings by Category:\n');
    
    Object.entries(categories).sort().forEach(([category, keys]) => {
      console.log(`\n${category} (${keys.length} settings):`);
      keys.forEach(key => console.log(`  • ${key}`));
    });
    
    console.log('\n\n✅ Summary:');
    Object.entries(categories).sort().forEach(([category, keys]) => {
      console.log(`  ${category}: ${keys.length} settings`);
    });
    
    const total = Object.values(categories).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`\n  Total: ${total} settings`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testCategorization();
