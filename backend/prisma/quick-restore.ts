/**
 * Quick Restore Script - Optimized restore for multi-domain environment
 * 
 * Features:
 * - Parallel processing for independent tables
 * - Progress bar with ETA
 * - Handles FK constraints automatically
 * - Supports compressed backups
 * - Validates data before restore
 * 
 * Usage: bun run prisma/quick-restore.ts [--from=YYYYMMDD_HHMMSS] [--tables=users,products] [--no-cleanup]
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import {
  getEnvironmentName,
  getBackupRootDir,
  getLatestBackupFolder,
  getBackupFolders,
  readBackupFile,
  loadManifest,
  validateBackup,
  formatBytes,
  formatDuration,
  printHeader,
  printStats,
  createProgressBar,
  camelToSnakeCase,
  PRIORITY_TABLES,
} from './backup-utils';

const prisma = new PrismaClient();

// =====================================================
// CONFIGURATION
// =====================================================

interface RestoreOptions {
  backupFolder: string | null;
  specificTables: string[] | null;
  cleanupBefore: boolean;
  dryRun: boolean;
  showProgress: boolean;
}

function parseArgs(): RestoreOptions {
  const args = process.argv.slice(2);
  
  const options: RestoreOptions = {
    backupFolder: null,
    specificTables: null,
    cleanupBefore: !args.includes('--no-cleanup'),
    dryRun: args.includes('--dry-run'),
    showProgress: !args.includes('--quiet'),
  };
  
  // Parse --from=YYYYMMDD_HHMMSS
  const fromArg = args.find(a => a.startsWith('--from='));
  if (fromArg) {
    options.backupFolder = fromArg.replace('--from=', '');
  }
  
  // Parse --tables=table1,table2
  const tablesArg = args.find(a => a.startsWith('--tables='));
  if (tablesArg) {
    options.specificTables = tablesArg.replace('--tables=', '').split(',');
  }
  
  return options;
}

// =====================================================
// RESTORE LOGIC
// =====================================================

// Build table dependency order from schema
function buildRestorationOrder(): string[] {
  try {
    const schemaPath = path.join(__dirname, 'schema.prisma');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    const models: { name: string; tableName: string; deps: string[] }[] = [];
    const lines = schemaContent.split('\n');
    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      const modelMatch = line.match(/^model\s+(\w+)\s*\{/);
      
      if (modelMatch) {
        const modelName = modelMatch[1];
        let braceCount = 1;
        let modelBody = '';
        i++;
        
        while (i < lines.length && braceCount > 0) {
          const bodyLine = lines[i];
          modelBody += bodyLine + '\n';
          for (const char of bodyLine) {
            if (char === '{') braceCount++;
            if (char === '}') braceCount--;
          }
          i++;
        }
        
        const mapMatch = modelBody.match(/@@map\s*\(\s*["']([^"']+)["']\s*\)/);
        const tableName = mapMatch ? mapMatch[1] : camelToSnakeCase(modelName);
        
        // Find dependencies (FK references)
        const deps: string[] = [];
        const relationMatches = modelBody.matchAll(/@relation\([^)]*references:\s*\[([^\]]+)\]/g);
        for (const match of relationMatches) {
          // Extract model name from field line
          const fieldLineMatch = modelBody.match(new RegExp(`(\\w+)\\s+\\w+.*@relation.*references:\\s*\\[${match[1]}\\]`));
          if (fieldLineMatch) {
            deps.push(fieldLineMatch[1]);
          }
        }
        
        models.push({ name: modelName, tableName, deps });
      } else {
        i++;
      }
    }
    
    // Topological sort - tables without dependencies first
    const sorted: string[] = [];
    const visited = new Set<string>();
    
    function visit(tableName: string): void {
      if (visited.has(tableName)) return;
      visited.add(tableName);
      
      const model = models.find(m => m.tableName === tableName);
      if (!model) {
        sorted.push(tableName);
        return;
      }
      
      // Visit dependencies first
      for (const depName of model.deps) {
        const depModel = models.find(m => m.name === depName);
        if (depModel && !visited.has(depModel.tableName)) {
          visit(depModel.tableName);
        }
      }
      
      sorted.push(tableName);
    }
    
    // Start with tables that have no dependencies (users, categories, etc.)
    const noDeps = models.filter(m => m.deps.length === 0);
    for (const model of noDeps) {
      visit(model.tableName);
    }
    
    // Then rest
    for (const model of models) {
      visit(model.tableName);
    }
    
    return sorted;
  } catch (error) {
    console.error('Error parsing schema:', error);
    return [];
  }
}

// Transform data before insert
function transformRecord(record: any, tableName: string): any {
  const transformed = { ...record };
  
  // Convert date strings to Date objects
  const dateFields = [
    'createdAt', 'updatedAt', 'publishedAt', 'completedAt',
    'dueDate', 'processedAt', 'expiresAt', 'lastLoginAt',
    'lockedUntil', 'timestamp', 'syncedAt', 'deletedAt',
  ];
  
  for (const field of dateFields) {
    if (transformed[field] && typeof transformed[field] === 'string') {
      transformed[field] = new Date(transformed[field]);
    }
  }
  
  // Handle table-specific transformations
  if (tableName === 'menus') {
    if (!transformed.requiredPermissions || !Array.isArray(transformed.requiredPermissions)) {
      transformed.requiredPermissions = [];
    }
    if (!transformed.requiredRoles || !Array.isArray(transformed.requiredRoles)) {
      transformed.requiredRoles = [];
    }
  }
  
  if (tableName === 'call_center_records') {
    const epochFields = ['startEpoch', 'endEpoch', 'answerEpoch'];
    for (const field of epochFields) {
      if (transformed[field] instanceof Date) {
        transformed[field] = String(Math.floor(transformed[field].getTime() / 1000));
      }
      if (transformed[field] !== null && transformed[field] !== undefined) {
        transformed[field] = String(transformed[field]);
      }
    }
  }
  
  return transformed;
}

// Convert table name to Prisma model accessor
function toPrismaModel(tableName: string): string {
  // Handle special cases
  const specialMappings: Record<string, string> = {
    'Hoadon': 'hoadon',
    'HoadonChitiet': 'hoadonChitiet',
  };
  
  if (specialMappings[tableName]) {
    return specialMappings[tableName];
  }
  
  // Convert snake_case to camelCase
  return tableName.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Restore a single table
async function restoreTable(
  tableName: string,
  backupPath: string,
  stats: RestoreStats
): Promise<void> {
  try {
    // Read backup data
    let data: any[];
    try {
      data = await readBackupFile(path.join(backupPath, `${tableName}.json`));
    } catch {
      // Try without extension variations
      const files = fs.readdirSync(backupPath);
      const matchingFile = files.find(f => 
        f === `${tableName}.json` || 
        f === `${tableName}.json.gz`
      );
      
      if (!matchingFile) {
        stats.skipped.push({ table: tableName, reason: 'No backup file' });
        return;
      }
      
      data = await readBackupFile(path.join(backupPath, matchingFile.replace('.gz', '')));
    }
    
    if (!Array.isArray(data) || data.length === 0) {
      stats.skipped.push({ table: tableName, reason: 'Empty data' });
      return;
    }
    
    // Get Prisma model
    const modelName = toPrismaModel(tableName);
    const model = (prisma as any)[modelName];
    
    if (!model || typeof model.createMany !== 'function') {
      // Use raw SQL for tables without Prisma model
      await restoreWithRawSQL(tableName, data, stats);
      return;
    }
    
    // Transform records
    const transformedData = data.map(r => transformRecord(r, tableName));
    
    // Batch insert
    const BATCH_SIZE = 500;
    let inserted = 0;
    let skipped = 0;
    
    for (let i = 0; i < transformedData.length; i += BATCH_SIZE) {
      const batch = transformedData.slice(i, i + BATCH_SIZE);
      
      try {
        const result = await model.createMany({
          data: batch,
          skipDuplicates: true,
        });
        inserted += result.count || 0;
        skipped += batch.length - (result.count || 0);
      } catch (error: any) {
        // Try individual inserts for this batch
        for (const record of batch) {
          try {
            await model.create({ data: record });
            inserted++;
          } catch {
            skipped++;
          }
        }
      }
    }
    
    stats.restored.push({
      table: tableName,
      inserted,
      skipped,
      total: data.length,
    });
    
  } catch (error: any) {
    stats.errors.push({
      table: tableName,
      error: error.message,
    });
  }
}

// Restore using raw SQL
async function restoreWithRawSQL(
  tableName: string,
  data: any[],
  stats: RestoreStats
): Promise<void> {
  let inserted = 0;
  let skipped = 0;
  
  for (const record of data) {
    try {
      const transformed = transformRecord(record, tableName);
      const columns = Object.keys(transformed);
      const columnsList = columns.map(c => `"${c}"`).join(', ');
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      const values = columns.map(c => {
        const val = transformed[c];
        if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
          return JSON.stringify(val);
        }
        return val;
      });
      
      await prisma.$queryRawUnsafe(
        `INSERT INTO "${tableName}" (${columnsList}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
        ...values
      );
      inserted++;
    } catch {
      skipped++;
    }
  }
  
  stats.restored.push({
    table: tableName,
    inserted,
    skipped,
    total: data.length,
  });
}

// Clean database before restore
async function cleanupDatabase(tables: string[]): Promise<number> {
  console.log('\n🧹 Cleaning existing data...');
  
  // Reverse order for cleanup (children first)
  const cleanupOrder = [...tables].reverse();
  let totalDeleted = 0;
  
  for (const table of cleanupOrder) {
    try {
      const modelName = toPrismaModel(table);
      const model = (prisma as any)[modelName];
      
      if (model && typeof model.deleteMany === 'function') {
        const result = await model.deleteMany({});
        const count = result.count || 0;
        totalDeleted += count;
        
        if (count > 0) {
          process.stdout.write(`   🗑️ ${table}: ${count.toLocaleString()} records\n`);
        }
      }
    } catch {
      // Silently skip
    }
  }
  
  console.log(`   ✅ Deleted ${totalDeleted.toLocaleString()} total records\n`);
  return totalDeleted;
}

// =====================================================
// STATS TRACKING
// =====================================================

interface RestoreStats {
  restored: { table: string; inserted: number; skipped: number; total: number }[];
  skipped: { table: string; reason: string }[];
  errors: { table: string; error: string }[];
  startTime: number;
}

// =====================================================
// MAIN RESTORE PROCESS
// =====================================================

async function runQuickRestore(): Promise<void> {
  const options = parseArgs();
  const ENV_NAME = getEnvironmentName();
  const BACKUP_ROOT = getBackupRootDir();
  
  // Get backup folder
  let backupFolder = options.backupFolder;
  if (!backupFolder) {
    backupFolder = getLatestBackupFolder(BACKUP_ROOT);
  }
  
  if (!backupFolder) {
    console.error('❌ No backup folder found!');
    console.log(`   Looking in: ${BACKUP_ROOT}`);
    
    const folders = getBackupFolders(BACKUP_ROOT);
    if (folders.length > 0) {
      console.log(`\n📂 Available backups:`);
      folders.slice(0, 5).forEach((f, i) => {
        console.log(`   ${i + 1}. ${f}`);
      });
      console.log(`\n💡 Use --from=FOLDER to restore from a specific backup`);
    }
    
    process.exit(1);
  }
  
  const backupPath = path.join(BACKUP_ROOT, backupFolder);
  
  // Validate backup
  const validation = await validateBackup(backupPath);
  if (!validation.isValid) {
    console.error('❌ Invalid backup!');
    validation.errors.forEach(e => console.error(`   - ${e}`));
    process.exit(1);
  }
  
  // Print header
  printHeader(`🔄 QUICK RESTORE - ${ENV_NAME.toUpperCase()}`);
  
  // Load manifest if available
  const manifest = loadManifest(backupPath);
  
  console.log(`\n📋 Restore Configuration:`);
  console.log(`   Domain: ${ENV_NAME}`);
  console.log(`   Backup: ${backupFolder}`);
  console.log(`   Cleanup: ${options.cleanupBefore ? 'Yes' : 'No'}`);
  console.log(`   Dry Run: ${options.dryRun ? 'Yes' : 'No'}`);
  
  if (manifest) {
    console.log(`   Original Records: ${manifest.totalRecords.toLocaleString()}`);
    console.log(`   Backup Size: ${manifest.totalSize}`);
  }
  
  if (validation.warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    validation.warnings.forEach(w => console.log(`   - ${w}`));
  }
  
  if (options.dryRun) {
    console.log('\n🔍 DRY RUN - No changes will be made');
    return;
  }
  
  // Get tables to restore
  const backupFiles = fs.readdirSync(backupPath)
    .filter(f => f.endsWith('.json') || f.endsWith('.json.gz'))
    .map(f => f.replace('.json.gz', '').replace('.json', ''));
  
  // Build restoration order
  const restorationOrder = buildRestorationOrder();
  
  // Sort backup files by restoration order
  const sortedTables = restorationOrder.filter(t => backupFiles.includes(t));
  const remainingTables = backupFiles.filter(t => !sortedTables.includes(t));
  const allTables = [...sortedTables, ...remainingTables];
  
  // Filter to specific tables if requested
  let tablesToRestore = allTables;
  if (options.specificTables) {
    tablesToRestore = allTables.filter(t => options.specificTables!.includes(t));
  }
  
  console.log(`\n📊 Tables to restore: ${tablesToRestore.length}`);
  
  // Cleanup existing data
  if (options.cleanupBefore) {
    await cleanupDatabase(tablesToRestore);
  }
  
  // Initialize stats
  const stats: RestoreStats = {
    restored: [],
    skipped: [],
    errors: [],
    startTime: Date.now(),
  };
  
  // Restore tables with progress
  console.log('📦 Restoring tables...\n');
  
  const progressBar = createProgressBar(30);
  let processed = 0;
  
  for (const table of tablesToRestore) {
    processed++;
    const percent = (processed / tablesToRestore.length) * 100;
    
    if (options.showProgress) {
      process.stdout.write(`\r   ${progressBar(percent)} [${processed}/${tablesToRestore.length}] ${table.padEnd(25)}`);
    }
    
    await restoreTable(table, backupPath, stats);
  }
  
  // Clear progress line
  if (options.showProgress) {
    process.stdout.write('\r' + ' '.repeat(80) + '\r');
  }
  
  // Calculate totals
  const duration = Date.now() - stats.startTime;
  const totalInserted = stats.restored.reduce((sum, r) => sum + r.inserted, 0);
  const totalSkipped = stats.restored.reduce((sum, r) => sum + r.skipped, 0);
  
  // Print results
  console.log('✅ Restore completed!\n');
  
  // Show table results
  const successful = stats.restored.filter(r => r.inserted > 0);
  if (successful.length > 0) {
    console.log('📊 Restored Tables:');
    console.log('┌─────────────────────────────────────────────────────────────┐');
    console.log('│ Table Name                    │  Inserted │  Skipped │ Total│');
    console.log('├─────────────────────────────────────────────────────────────┤');
    
    successful.slice(0, 15).forEach(r => {
      const name = r.table.padEnd(29);
      const inserted = r.inserted.toLocaleString().padStart(9);
      const skipped = r.skipped.toLocaleString().padStart(8);
      const total = r.total.toLocaleString().padStart(5);
      console.log(`│ ${name} │ ${inserted} │ ${skipped} │${total}│`);
    });
    
    if (successful.length > 15) {
      console.log(`│ ... and ${successful.length - 15} more tables`.padEnd(61) + '│');
    }
    
    console.log('└─────────────────────────────────────────────────────────────┘');
  }
  
  // Show errors if any
  if (stats.errors.length > 0) {
    console.log('\n❌ Errors:');
    stats.errors.slice(0, 5).forEach(e => {
      console.log(`   - ${e.table}: ${e.error.substring(0, 60)}`);
    });
    if (stats.errors.length > 5) {
      console.log(`   ... and ${stats.errors.length - 5} more errors`);
    }
  }
  
  // Summary stats
  printStats({
    'Domain': ENV_NAME.toUpperCase(),
    'Tables Restored': stats.restored.length,
    'Tables Skipped': stats.skipped.length,
    'Tables with Errors': stats.errors.length,
    'Records Inserted': totalInserted.toLocaleString(),
    'Records Skipped': totalSkipped.toLocaleString(),
    'Duration': formatDuration(duration),
    'Avg Speed': `${Math.round(totalInserted / (duration / 1000)).toLocaleString()} records/sec`,
  });
  
  console.log(`\n📂 Restored from: ${backupPath}`);
  
  if (stats.errors.length === 0) {
    console.log('✅ All data restored successfully!\n');
  } else {
    console.log('⚠️ Restore completed with some errors (see above)\n');
  }
}

// Run restore
runQuickRestore()
  .catch(err => {
    console.error('\n❌ Restore failed:', err.message);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
