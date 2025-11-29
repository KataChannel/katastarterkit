import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupConfigs() {
  console.log('🔍 Cleaning up Call Center configurations...\n');

  try {
    const configs = await prisma.callCenterConfig.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    if (configs.length === 0) {
      console.log('❌ No Call Center configurations found.');
      return;
    }

    console.log(`📋 Found ${configs.length} configuration(s)\n`);

    // Keep the most recently updated active config
    const activeConfig = configs.find(c => c.isActive);
    
    if (!activeConfig) {
      console.log('⚠️  No active config found. Activating the most recent one...');
      const mostRecent = configs[0];
      await prisma.callCenterConfig.update({
        where: { id: mostRecent.id },
        data: { isActive: true },
      });
      console.log(`✅ Activated config: ${mostRecent.id}\n`);
    }

    // Get the config to keep (most recently updated active one)
    const configToKeep = await prisma.callCenterConfig.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });

    if (!configToKeep) {
      console.log('❌ Could not determine which config to keep.');
      return;
    }

    console.log('✅ Keeping this configuration:');
    console.log(`   ID: ${configToKeep.id}`);
    console.log(`   Domain: ${configToKeep.domain}`);
    console.log(`   Sync Mode: ${configToKeep.syncMode}`);
    console.log(`   Is Active: ${configToKeep.isActive ? '✅' : '❌'}`);
    console.log(`   Updated: ${configToKeep.updatedAt}\n`);

    // Delete all other configs
    const configsToDelete = configs.filter(c => c.id !== configToKeep.id);
    
    if (configsToDelete.length > 0) {
      console.log(`🗑️  Deleting ${configsToDelete.length} duplicate configuration(s)...\n`);
      
      for (const config of configsToDelete) {
        await prisma.callCenterConfig.delete({
          where: { id: config.id },
        });
        console.log(`   ✅ Deleted config: ${config.id}`);
      }
    } else {
      console.log('ℹ️  No duplicate configurations to delete.');
    }

    console.log('\n✅ Cleanup completed!');
    console.log('   Only one active configuration remains.');

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupConfigs();
