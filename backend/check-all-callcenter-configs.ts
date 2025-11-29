import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAllConfigs() {
  console.log('🔍 Checking all Call Center configurations...\n');

  try {
    const configs = await prisma.callCenterConfig.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (configs.length === 0) {
      console.log('❌ No Call Center configurations found.');
      return;
    }

    console.log(`📋 Found ${configs.length} configuration(s):\n`);

    configs.forEach((config, index) => {
      console.log(`Configuration #${index + 1}:`);
      console.log(`   ID: ${config.id}`);
      console.log(`   API URL: ${config.apiUrl}`);
      console.log(`   Domain: ${config.domain}`);
      console.log(`   Sync Mode: ${config.syncMode}`);
      console.log(`   Is Active: ${config.isActive ? '✅' : '❌'}`);
      console.log(`   Created: ${config.createdAt}`);
      console.log(`   Updated: ${config.updatedAt}`);
      console.log(`   Total Synced: ${config.totalRecordsSynced || 0}`);
      console.log('');
    });

    // Activate all configs
    console.log('🔧 Activating all configurations...\n');
    
    for (const config of configs) {
      if (!config.isActive) {
        await prisma.callCenterConfig.update({
          where: { id: config.id },
          data: { isActive: true },
        });
        console.log(`✅ Activated config: ${config.id}`);
      } else {
        console.log(`ℹ️  Already active: ${config.id}`);
      }
    }

    console.log('\n✅ All configurations are now active!');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllConfigs();
