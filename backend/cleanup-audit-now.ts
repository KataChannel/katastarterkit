import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
  console.log('🧹 Starting immediate audit logs cleanup...\n');

  try {
    // 1. Backup count trước khi xóa
    const totalBefore = await prisma.auditLog.count();
    console.log(`📊 Total logs before cleanup: ${totalBefore.toLocaleString()}`);

    // 2. Xóa health check logs (ROOT endpoint)
    console.log('\n🗑️  Deleting health check logs...');
    const healthChecks = await prisma.auditLog.deleteMany({
      where: { 
        OR: [
          { action: 'POST_/' },
          { action: 'GET_/' },
          { endpoint: '/' },
          { endpoint: { startsWith: '/_next' } },
          { endpoint: { startsWith: '/health' } },
          { endpoint: { startsWith: '/ping' } },
          { endpoint: { startsWith: '/metrics' } },
        ]
      }
    });
    console.log(`   ✅ Deleted ${healthChecks.count.toLocaleString()} health check logs`);

    // 3. Xóa old debug logs (> 7 days)
    console.log('\n🗑️  Deleting old debug logs (>7 days)...');
    const oldDebug = await prisma.auditLog.deleteMany({
      where: {
        severity: 'debug',
        timestamp: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });
    console.log(`   ✅ Deleted ${oldDebug.count.toLocaleString()} old debug logs`);

    // 4. Xóa old info logs (> 30 days) không quan trọng
    console.log('\n🗑️  Deleting old info logs (>30 days)...');
    const oldInfo = await prisma.auditLog.deleteMany({
      where: {
        severity: 'info',
        timestamp: {
          lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        requiresReview: false,
        sensitiveData: false
      }
    });
    console.log(`   ✅ Deleted ${oldInfo.count.toLocaleString()} old info logs`);

    // 5. Skip duplicate cleanup for now (will be done by cron job)
    console.log('\n⏭️  Skipping duplicate cleanup (will run in scheduled job)...');

    // 6. Final stats
    const totalAfter = await prisma.auditLog.count();
    const totalDeleted = totalBefore - totalAfter;
    const percentReduced = ((totalDeleted / totalBefore) * 100).toFixed(2);

    console.log('\n' + '='.repeat(60));
    console.log('📊 CLEANUP SUMMARY');
    console.log('='.repeat(60));
    console.log(`Before:  ${totalBefore.toLocaleString()} logs`);
    console.log(`After:   ${totalAfter.toLocaleString()} logs`);
    console.log(`Deleted: ${totalDeleted.toLocaleString()} logs (${percentReduced}% reduction)`);
    console.log('='.repeat(60));

    // 7. Calculate space saved
    const avgSize = 1905; // bytes from analysis
    const spaceSaved = (totalDeleted * avgSize) / (1024 * 1024);
    console.log(`\n💾 Estimated space saved: ${spaceSaved.toFixed(2)} MB`);

    // 8. Check remaining by severity
    console.log('\n📈 Remaining logs by severity:');
    const bySeverity = await prisma.auditLog.groupBy({
      by: ['severity'],
      _count: true,
      orderBy: { _count: { severity: 'desc' } }
    });
    bySeverity.forEach(({ severity, _count }) => {
      console.log(`   ${severity}: ${_count.toLocaleString()}`);
    });

    console.log('\n✅ Cleanup completed successfully!');

  } catch (error) {
    console.error('\n❌ Cleanup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanup().catch(console.error);
