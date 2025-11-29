import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { AuditOptimizationService } from './src/audit/audit-optimization.service';
import { SmartAuditService } from './src/audit/smart-audit.service';

/**
 * Test Audit Optimization Services
 */
async function testAuditServices() {
  console.log('🧪 Testing Audit Optimization Services\n');
  
  try {
    // Bootstrap NestJS app
    const app = await NestFactory.createApplicationContext(AppModule);
    
    // Get services
    const optimizationService = app.get(AuditOptimizationService);
    const smartAuditService = app.get(SmartAuditService);
    
    console.log('✅ Services loaded successfully\n');
    
    // Test 1: Check storage stats
    console.log('📊 Test 1: Get storage stats');
    const stats = await optimizationService.getStorageStats();
    console.log('Stats:', stats);
    console.log('');
    
    // Test 2: Test shouldSkipLogging
    console.log('🔍 Test 2: Test shouldSkipLogging');
    const testRequests = [
      { url: '/' },
      { url: '/health' },
      { url: '/graphql' },
      { url: '/api/users' },
    ];
    
    testRequests.forEach(req => {
      const shouldSkip = optimizationService.shouldSkipLogging(req);
      console.log(`  ${req.url}: ${shouldSkip ? 'SKIP' : 'LOG'}`);
    });
    console.log('');
    
    // Test 3: Test sampling
    console.log('🎲 Test 3: Test log sampling');
    const actions = [
      { action: 'POST_/graphql', severity: 'info' },
      { action: 'LOGIN', severity: 'warn' },
      { action: 'DELETE_USER', severity: 'error' },
    ];
    
    actions.forEach(({ action, severity }) => {
      let logCount = 0;
      const iterations = 100;
      
      for (let i = 0; i < iterations; i++) {
        if (optimizationService.shouldSampleLog(action, 0.1)) {
          logCount++;
        }
      }
      
      console.log(`  ${action} (${severity}): ${logCount}/${iterations} logged`);
    });
    console.log('');
    
    // Test 4: Test cleanup duplicates (dry run)
    console.log('🧹 Test 4: Check for duplicates');
    try {
      // Just check, don't actually delete
      const duplicates = await optimizationService['prisma'].$queryRaw<any[]>`
        SELECT 
          action,
          endpoint,
          DATE_TRUNC('second', timestamp) as time_bucket,
          COUNT(*) as count
        FROM audit_logs
        WHERE timestamp >= NOW() - INTERVAL '7 days'
        GROUP BY action, endpoint, time_bucket
        HAVING COUNT(*) > 1
        ORDER BY count DESC
        LIMIT 5
      `;
      
      if (duplicates.length > 0) {
        console.log('  Found duplicate patterns:');
        duplicates.forEach(dup => {
          console.log(`    ${dup.action} @ ${dup.endpoint}: ${dup.count} duplicates`);
        });
      } else {
        console.log('  ✅ No duplicates found');
      }
    } catch (error) {
      console.log('  ⚠️  Could not check duplicates:', error.message);
    }
    console.log('');
    
    // Test 5: Manual cleanup test
    console.log('🗑️  Test 5: Test manual cleanup (dry run)');
    const healthCheckCount = await optimizationService['prisma'].auditLog.count({
      where: { 
        OR: [
          { action: 'POST_/' },
          { action: 'GET_/' },
        ]
      }
    });
    console.log(`  Health check logs to clean: ${healthCheckCount}`);
    console.log('');
    
    console.log('✅ All tests completed!\n');
    
    // Close app
    await app.close();
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testAuditServices();
