/**
 * Smart Backup Script - Optimized backup for multi-domain environment
 * 
 * Features:
 * - Prioritizes critical tables
 * - Skips regeneratable data (logs, cache)
 * - Compression support
 * - Progress tracking
 * - Auto-cleanup old backups
 * 
 * Usage: bun run prisma/smart-backup.ts [--full] [--no-compress] [--tables=users,products]
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import {
  getEnvironmentName,
  getBackupRootDir,
  getFormattedDate,
  getExistingTables,
  getTableRecordCount,
  tableExists,
  parseSchemaModels,
  writeBackupFile,
  cleanupOldBackups,
  createManifest,
  saveManifest,
  formatBytes,
  formatDuration,
  printHeader,
  printStats,
  createProgressBar,
  PRIORITY_TABLES,
  SKIP_TABLES,
  type ProgressCallback,
} from './backup-utils';

const prisma = new PrismaClient();

// =====================================================
// CONFIGURATION
// =====================================================

interface BackupOptions {
  fullBackup: boolean;
  compress: boolean;
  specificTables: string[] | null;
  maxBackups: number;
  showProgress: boolean;
}

function parseArgs(): BackupOptions {
  const args = process.argv.slice(2);
  
  const options: BackupOptions = {
    fullBackup: args.includes('--full'),
    compress: !args.includes('--no-compress'),
    specificTables: null,
    maxBackups: 5,
    showProgress: !args.includes('--quiet'),
  };
  
  // Parse --tables=table1,table2
  const tablesArg = args.find(a => a.startsWith('--tables='));
  if (tablesArg) {
    options.specificTables = tablesArg.replace('--tables=', '').split(',');
  }
  
  // Parse --max-backups=N
  const maxArg = args.find(a => a.startsWith('--max-backups='));
  if (maxArg) {
    options.maxBackups = parseInt(maxArg.replace('--max-backups=', '')) || 5;
  }
  
  return options;
}

// =====================================================
// BACKUP LOGIC
// =====================================================

async function getTablesToBackup(options: BackupOptions): Promise<string[]> {
  // Get all tables from database
  const existingTables = await getExistingTables(prisma);
  
  // If specific tables requested
  if (options.specificTables) {
    return options.specificTables.filter(t => existingTables.includes(t));
  }
  
  // If full backup, return all tables
  if (options.fullBackup) {
    return existingTables;
  }
  
  // Smart backup: prioritize important tables, skip cache/logs
  const schemaModels = parseSchemaModels();
  const schemaTables = schemaModels.map(m => m.tableName);
  
  // Filter out skip tables
  const filteredTables = existingTables.filter(t => !SKIP_TABLES.includes(t));
  
  // Sort: priority tables first, then by schema order
  return filteredTables.sort((a, b) => {
    const aPriority = PRIORITY_TABLES.includes(a);
    const bPriority = PRIORITY_TABLES.includes(b);
    
    if (aPriority && !bPriority) return -1;
    if (!aPriority && bPriority) return 1;
    
    const aIndex = schemaTables.indexOf(a);
    const bIndex = schemaTables.indexOf(b);
    
    if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
    if (aIndex >= 0) return -1;
    if (bIndex >= 0) return 1;
    
    return a.localeCompare(b);
  });
}

async function backupTable(
  table: string,
  backupDir: string,
  compress: boolean,
  onProgress?: ProgressCallback
): Promise<{ records: number; size: number; compressed: boolean } | null> {
  try {
    // Check if table exists
    if (!(await tableExists(prisma, table))) {
      return null;
    }
    
    // Get all data from table
    const data: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "${table}"`);
    
    if (data.length === 0) {
      return null;
    }
    
    // Write backup file
    const filePath = path.join(backupDir, `${table}.json`);
    const result = await writeBackupFile(filePath, data, compress);
    
    return {
      records: data.length,
      size: result.size,
      compressed: result.compressed,
    };
  } catch (error: any) {
    if (error.code === '42P01') {
      // Table doesn't exist, skip silently
      return null;
    }
    console.error(`  ❌ Error backing up ${table}: ${error.message}`);
    return null;
  }
}

// =====================================================
// MAIN BACKUP PROCESS
// =====================================================

async function runSmartBackup(): Promise<void> {
  const startTime = Date.now();
  const options = parseArgs();
  const ENV_NAME = getEnvironmentName();
  const BACKUP_ROOT = getBackupRootDir();
  const BACKUP_DIR = path.join(BACKUP_ROOT, getFormattedDate());
  
  // Print header
  printHeader(`🚀 SMART BACKUP - ${ENV_NAME.toUpperCase()}`);
  
  console.log(`\n📋 Configuration:`);
  console.log(`   Domain: ${ENV_NAME}`);
  console.log(`   Mode: ${options.fullBackup ? 'FULL' : 'SMART'}`);
  console.log(`   Compression: ${options.compress ? 'Enabled' : 'Disabled'}`);
  console.log(`   Max Backups: ${options.maxBackups}`);
  console.log(`   Backup Dir: ${BACKUP_DIR}`);
  
  // Create backup directory
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  
  // Get tables to backup
  console.log('\n🔍 Analyzing tables...');
  const tables = await getTablesToBackup(options);
  console.log(`   Found ${tables.length} tables to backup`);
  
  if (!options.fullBackup) {
    console.log(`   Skipping ${SKIP_TABLES.filter(t => !options.specificTables).length} cache/log tables`);
  }
  
  // Backup each table with progress
  console.log('\n📦 Backing up tables...\n');
  
  const progressBar = createProgressBar(30);
  const results: { name: string; records: number; size: number; compressed: boolean }[] = [];
  let totalRecords = 0;
  let processedTables = 0;
  
  for (const table of tables) {
    processedTables++;
    const percent = (processedTables / tables.length) * 100;
    
    // Output progress in parseable format for API tracking
    console.log(`[PROGRESS:${processedTables}/${tables.length}] ${Math.round(percent)}% - ${table}`);
    
    const result = await backupTable(table, BACKUP_DIR, options.compress);
    
    if (result) {
      results.push({
        name: table,
        records: result.records,
        size: result.size,
        compressed: result.compressed,
      });
      totalRecords += result.records;
    }
  }
  
  // Calculate totals
  const duration = Date.now() - startTime;
  const totalSize = results.reduce((sum, r) => sum + r.size, 0);
  
  // Create and save manifest
  const manifest = createManifest(ENV_NAME, results, duration);
  saveManifest(BACKUP_DIR, manifest);
  
  // Cleanup old backups
  const deleted = cleanupOldBackups(BACKUP_ROOT, options.maxBackups);
  
  // Print results
  console.log('✅ Backup completed successfully!\n');
  
  // Show top tables by record count
  const topTables = [...results].sort((a, b) => b.records - a.records).slice(0, 10);
  
  console.log('📊 Top 10 Tables by Records:');
  console.log('┌────────────────────────────────────────────────────────────────┐');
  console.log('│  #  │ Table Name                    │   Records │     Size    │');
  console.log('├────────────────────────────────────────────────────────────────┤');
  
  topTables.forEach((t, i) => {
    const num = `${i + 1}`.padStart(3);
    const name = t.name.padEnd(29);
    const records = t.records.toLocaleString().padStart(9);
    const size = formatBytes(t.size).padStart(11);
    console.log(`│ ${num} │ ${name} │ ${records} │ ${size} │`);
  });
  
  console.log('└────────────────────────────────────────────────────────────────┘');
  
  // Summary stats
  printStats({
    'Domain': ENV_NAME.toUpperCase(),
    'Tables Backed Up': results.length,
    'Tables Skipped': tables.length - results.length,
    'Total Records': totalRecords.toLocaleString(),
    'Total Size': formatBytes(totalSize),
    'Compression': options.compress ? 'Yes' : 'No',
    'Duration': formatDuration(duration),
    'Avg Speed': `${Math.round(totalRecords / (duration / 1000)).toLocaleString()} records/sec`,
    'Old Backups Deleted': deleted,
  });
  
  console.log(`\n📂 Backup saved to: ${BACKUP_DIR}`);
  console.log(`💡 To restore, run: bun run db:restore:${ENV_NAME}\n`);
}

// Run backup
runSmartBackup()
  .catch(err => {
    console.error('\n❌ Backup failed:', err.message);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
