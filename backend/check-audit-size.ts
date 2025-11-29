import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAuditSize() {
  console.log('=== AUDIT LOGS ANALYSIS ===\n');
  
  // Total count
  const totalCount = await prisma.auditLog.count();
  console.log(`Total audit logs: ${totalCount.toLocaleString()}`);
  
  // Count by date range
  const last7Days = await prisma.auditLog.count({
    where: { timestamp: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
  });
  const last30Days = await prisma.auditLog.count({
    where: { timestamp: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
  });
  const last90Days = await prisma.auditLog.count({
    where: { timestamp: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } }
  });
  
  console.log(`\nLogs by time period:`);
  console.log(`  Last 7 days: ${last7Days.toLocaleString()}`);
  console.log(`  Last 30 days: ${last30Days.toLocaleString()}`);
  console.log(`  Last 90 days: ${last90Days.toLocaleString()}`);
  console.log(`  Older than 90 days: ${(totalCount - last90Days).toLocaleString()}`);
  
  // By action type
  const byAction = await prisma.auditLog.groupBy({
    by: ['action'],
    _count: true,
    orderBy: { _count: { action: 'desc' } },
    take: 10
  });
  
  console.log(`\nTop 10 actions:`);
  byAction.forEach(({ action, _count }) => {
    console.log(`  ${action}: ${_count.toLocaleString()}`);
  });
  
  // By resource type
  const byResource = await prisma.auditLog.groupBy({
    by: ['resourceType'],
    _count: true,
    orderBy: { _count: { resourceType: 'desc' } },
    take: 10
  });
  
  console.log(`\nTop 10 resource types:`);
  byResource.forEach(({ resourceType, _count }) => {
    console.log(`  ${resourceType}: ${_count.toLocaleString()}`);
  });
  
  // Avg size estimation
  const sampleLogs = await prisma.auditLog.findMany({
    take: 100,
    orderBy: { timestamp: 'desc' }
  });
  
  const avgSize = sampleLogs.reduce((sum, log) => {
    const jsonSize = JSON.stringify(log).length;
    return sum + jsonSize;
  }, 0) / sampleLogs.length;
  
  const estimatedTotalSize = (avgSize * totalCount) / (1024 * 1024); // MB
  
  console.log(`\nSize estimation:`);
  console.log(`  Avg log entry size: ${Math.round(avgSize)} bytes`);
  console.log(`  Estimated total size: ${estimatedTotalSize.toFixed(2)} MB`);
  
  // Performance data check
  const withPerformanceData = await prisma.auditLog.count({
    where: { performanceData: { not: null } }
  });
  
  console.log(`\nPerformance data:`);
  console.log(`  Logs with performance data: ${withPerformanceData.toLocaleString()} (${((withPerformanceData/totalCount)*100).toFixed(2)}%)`);
  
  await prisma.$disconnect();
}

checkAuditSize().catch(console.error);
