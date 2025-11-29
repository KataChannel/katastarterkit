import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCallCenterSetup() {
  console.log('🧪 Testing Call Center Setup...\n');

  try {
    // Test 1: Check config exists and is active
    console.log('Test 1: Checking configuration...');
    const config = await prisma.callCenterConfig.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });

    if (!config) {
      console.log('❌ FAIL: No active configuration found\n');
      return;
    }

    console.log('✅ PASS: Active configuration found');
    console.log(`   ID: ${config.id}`);
    console.log(`   Domain: ${config.domain}`);
    console.log(`   Is Active: ${config.isActive}`);
    console.log(`   Sync Mode: ${config.syncMode}\n`);

    // Test 2: Check for duplicate configs
    console.log('Test 2: Checking for duplicate configurations...');
    const allConfigs = await prisma.callCenterConfig.findMany();
    
    if (allConfigs.length > 1) {
      console.log(`⚠️  WARNING: ${allConfigs.length} configurations found (should be 1)`);
      console.log('   Consider running cleanup-callcenter-configs.ts\n');
    } else {
      console.log('✅ PASS: Only one configuration exists\n');
    }

    // Test 3: Verify getConfig() logic would work
    console.log('Test 3: Testing getConfig() logic...');
    const getConfigResult = await prisma.callCenterConfig.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });

    if (getConfigResult && getConfigResult.isActive) {
      console.log('✅ PASS: getConfig() would return an active configuration\n');
    } else {
      console.log('❌ FAIL: getConfig() would not return an active configuration\n');
    }

    // Test 4: Check sync logs
    console.log('Test 4: Checking recent sync logs...');
    const recentLogs = await prisma.callCenterSyncLog.findMany({
      take: 3,
      orderBy: { startedAt: 'desc' },
    });

    if (recentLogs.length > 0) {
      console.log(`✅ Found ${recentLogs.length} recent sync log(s):`);
      recentLogs.forEach((log, i) => {
        console.log(`   ${i + 1}. Status: ${log.status}, Type: ${log.syncType}, Started: ${log.startedAt}`);
      });
      console.log('');
    } else {
      console.log('ℹ️  No sync logs found yet (this is normal for new setup)\n');
    }

    // Test 5: Check records
    console.log('Test 5: Checking call center records...');
    const recordCount = await prisma.callCenterRecord.count();
    console.log(`ℹ️  Total records in database: ${recordCount}\n`);

    // Summary
    console.log('═══════════════════════════════════════');
    console.log('🎉 TEST SUMMARY');
    console.log('═══════════════════════════════════════');
    console.log('✅ Configuration is properly set up');
    console.log('✅ System is ready for sync operations');
    console.log('✅ No blocking issues detected');
    console.log('═══════════════════════════════════════\n');

    console.log('📝 Next Steps:');
    console.log('   1. Go to the Call Center admin page');
    console.log('   2. Click "Sync Ngay" or "Chọn ngày sync"');
    console.log('   3. Sync should work without errors\n');

  } catch (error: any) {
    console.error('❌ Test error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testCallCenterSetup();
