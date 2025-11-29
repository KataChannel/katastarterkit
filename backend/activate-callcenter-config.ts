import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function activateCallCenterConfig() {
  console.log('🔍 Checking Call Center configuration...\n');

  try {
    // Get the first config
    const config = await prisma.callCenterConfig.findFirst();

    if (!config) {
      console.log('❌ No Call Center configuration found.');
      console.log('   Please create a configuration first in the admin panel.');
      return;
    }

    console.log('📋 Current Configuration:');
    console.log(`   ID: ${config.id}`);
    console.log(`   API URL: ${config.apiUrl}`);
    console.log(`   Domain: ${config.domain}`);
    console.log(`   Sync Mode: ${config.syncMode}`);
    console.log(`   Is Active: ${config.isActive ? '✅' : '❌'}`);
    console.log(`   Default Days Back: ${config.defaultDaysBack}`);
    console.log(`   Batch Size: ${config.batchSize}\n`);

    if (config.isActive) {
      console.log('✅ Configuration is already active!');
      console.log('   You can now sync Call Center data.');
    } else {
      console.log('⚠️  Configuration is INACTIVE.');
      console.log('   Activating...\n');

      const updated = await prisma.callCenterConfig.update({
        where: { id: config.id },
        data: { isActive: true },
      });

      console.log('✅ Configuration has been activated!');
      console.log('   You can now sync Call Center data.');
    }

    // Show last sync info if available
    if (config.lastSyncAt) {
      console.log('\n📊 Last Sync Information:');
      console.log(`   Date: ${config.lastSyncAt}`);
      console.log(`   Status: ${config.lastSyncStatus || 'N/A'}`);
      console.log(`   Total Records Synced: ${config.totalRecordsSynced || 0}`);
      if (config.lastSyncError) {
        console.log(`   Last Error: ${config.lastSyncError}`);
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

activateCallCenterConfig();
