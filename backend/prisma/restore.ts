import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { Transform } from 'stream';
import * as readline from 'readline';

const prisma = new PrismaClient();

// Cache for schema-based model mappings
let tableToModelMappingCache: { [tableName: string]: string } | null = null;

const BACKUP_ROOT_DIR = './kata_json';
const BATCH_SIZE = 1000; // Process records in batches of 1000
const STREAM_BUFFER_SIZE = 50; // Keep 50 batches in memory

interface RestoreStats {
  tablesProcessed: number;
  recordsRestored: number;
  recordsSkipped: number;
  errors: string[];
  warnings: string[];
  backupFolder?: string;
  startTime: number;
  tableStats: Map<string, { restored: number; skipped: number; errors: number }>;
}

const stats: RestoreStats = {
  tablesProcessed: 0,
  recordsRestored: 0,
  recordsSkipped: 0,
  errors: [],
  warnings: [],
  startTime: Date.now(),
  tableStats: new Map(),
};

/**
 * Get latest backup folder
 */
function getLatestBackupFolder(): string | null {
  try {
    if (!fs.existsSync(BACKUP_ROOT_DIR)) {
      console.error(`⚠️ Backup directory does not exist: ${BACKUP_ROOT_DIR}`);
      return null;
    }

    const folders = fs.readdirSync(BACKUP_ROOT_DIR)
      .filter(folder => fs.statSync(path.join(BACKUP_ROOT_DIR, folder)).isDirectory())
      .sort()
      .reverse();
    return folders[0] || null;
  } catch (error) {
    console.error(`⚠️ Cannot read backup directory: ${error}`);
    return null;
  }
}

/**
 * Get file size in MB
 */
function getFileSizeInMB(filePath: string): number {
  const stats = fs.statSync(filePath);
  return stats.size / (1024 * 1024);
}

/**
 * Stream-based JSON parser for large files
 */
async function parseJsonStreaming(filePath: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const lines: any[] = [];
    let fileContent = '';

    const rl = readline.createInterface({
      input: fs.createReadStream(filePath),
      crlfDelay: Infinity,
    });

    rl.on('line', (line) => {
      fileContent += line;
    });

    rl.on('close', () => {
      try {
        const data = JSON.parse(fileContent);
        resolve(Array.isArray(data) ? data : []);
      } catch (error) {
        reject(error);
      }
    });

    rl.on('error', reject);
  });
}

/**
 * Transform raw data - convert date strings to Date objects and remove unknown fields
 */
function transformRecord(record: any, tableName?: string): any {
  const transformed = { ...record };
  const dateFields = [
    'createdAt', 'updatedAt', 'publishedAt', 'completedAt',
    'dueDate', 'processedAt', 'expiresAt', 'lastLoginAt',
    'lockedUntil', 'startEpoch', 'endEpoch', 'answerEpoch', 'timestamp',
  ];

  // Convert date strings
  for (const field of dateFields) {
    if (transformed[field] && typeof transformed[field] === 'string') {
      transformed[field] = new Date(transformed[field]);
    }
  }

  // Handle website_settings specific transformations
  if (tableName === 'website_settings') {
    // Ensure options is JSON object/array
    if (transformed.options && typeof transformed.options === 'string') {
      try {
        transformed.options = JSON.parse(transformed.options);
      } catch {
        transformed.options = null;
      }
    }
    // Ensure validation is JSON object
    if (transformed.validation && typeof transformed.validation === 'string') {
      try {
        transformed.validation = JSON.parse(transformed.validation);
      } catch {
        transformed.validation = null;
      }
    }
    // Ensure key field is not null (it's unique and required)
    if (!transformed.key) {
      transformed.key = `setting_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }
  }

  // Handle audit_logs specific transformations
  if (tableName === 'audit_logs') {
    // Convert 'details' string to JSON object if it's a string
    if (transformed.details && typeof transformed.details === 'string') {
      transformed.details = { message: transformed.details };
    }
    // Ensure sessionInfo is JSON
    if (transformed.sessionInfo && typeof transformed.sessionInfo === 'string') {
      try {
        transformed.sessionInfo = JSON.parse(transformed.sessionInfo);
      } catch {
        transformed.sessionInfo = { raw: transformed.sessionInfo };
      }
    }
    // Ensure clientInfo is JSON
    if (transformed.clientInfo && typeof transformed.clientInfo === 'string') {
      try {
        transformed.clientInfo = JSON.parse(transformed.clientInfo);
      } catch {
        transformed.clientInfo = { raw: transformed.clientInfo };
      }
    }
    // Ensure required fields have defaults
    if (!transformed.resourceType) {
      transformed.resourceType = 'unknown';
    }
    if (!transformed.action) {
      transformed.action = 'unknown';
    }
    // tags is a required array field
    if (!transformed.tags || !Array.isArray(transformed.tags)) {
      transformed.tags = [];
    }
  }

  // Handle call_center_config specific transformations
  if (tableName === 'call_center_config') {
    // Remove unknown fields
    const unknownFields = ['_id'];
    for (const field of unknownFields) {
      delete transformed[field];
    }
  }

  // Handle menus specific transformations
  if (tableName === 'menus') {
    // requiredPermissions and requiredRoles are required String[] fields
    if (!transformed.requiredPermissions || !Array.isArray(transformed.requiredPermissions)) {
      transformed.requiredPermissions = [];
    }
    if (!transformed.requiredRoles || !Array.isArray(transformed.requiredRoles)) {
      transformed.requiredRoles = [];
    }
  }

  return transformed;
}

/**
 * Batch insert with optimized error handling
 */
async function batchInsert(
  model: any,
  table: string,
  records: any[],
  batchSize: number = BATCH_SIZE,
): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  // Try batch insert first with dynamic batch sizing
  try {
    // For menus table, use upsert to handle UNIQUE slug constraint
    if (table === 'menus') {
      const errors: any[] = [];
      for (const record of records) {
        try {
          await model.upsert({
            where: { slug: record.slug },
            update: record,
            create: record,
          });
          inserted++;
        } catch (error: any) {
          skipped++;
          errors.push({ slug: record.slug, error: error.message });
        }
      }
      if (errors.length > 0) {
        console.log(`   ⚠️  ${errors.length} menus failed:`);
        errors.forEach(e => console.log(`      - ${e.slug}: ${e.error.substring(0, 80)}`));
      }
      return { inserted, skipped };
    }

    // For other tables, use createMany with skipDuplicates
    const result = await model.createMany({
      data: records,
      skipDuplicates: true,
    });
    inserted = result.count || records.length;
    return { inserted, skipped: records.length - inserted };
  } catch (batchError: any) {
    // Log the error for debugging
    const errorMsg = (batchError?.message || String(batchError)).toString();
    if (table === 'audit_logs' || table === 'call_center_config') {
      // Write full error to a debug file
      const fs = require('fs');
      fs.appendFileSync('/tmp/restore_error.log', `\n=== ${table} Error ===\n${errorMsg}\n`);
      console.log(`   ⚠️  Error logged to /tmp/restore_error.log`);
    }
    
    // If batch fails and batch size > 100, try smaller batches
    if (batchSize > 100) {
      const smallerBatchSize = Math.max(100, Math.floor(batchSize / 2));
      console.log(`   ⚠️  Batch insert failed, retrying with smaller batches (${smallerBatchSize} records)...`);
      
      for (let i = 0; i < records.length; i += smallerBatchSize) {
        const chunk = records.slice(i, i + smallerBatchSize);
        try {
          const result = await model.createMany({
            data: chunk,
            skipDuplicates: true,
          });
          inserted += result.count || 0;
        } catch (error) {
          // Fall back to individual inserts for this chunk
          for (const record of chunk) {
            try {
              await model.create({ data: record });
              inserted++;
            } catch (recordError) {
              skipped++;
            }
          }
        }
      }
      return { inserted, skipped };
    } else {
      // Already at small batch size, try individual inserts
      console.log(`   ⚠️  Batch insert failed, trying individual records...`);
      
      for (const record of records) {
        try {
          await model.create({ data: record });
          inserted++;
        } catch (error) {
          skipped++;
        }
      }
      return { inserted, skipped };
    }
  }
}

/**
 * Restore table with streaming for large files
 */
async function restoreTableOptimized(
  table: string,
  backupFolder: string,
): Promise<void> {
  try {
    const filePath = path.join(BACKUP_ROOT_DIR, backupFolder, `${table}.json`);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Backup file not found for table ${table}`);
      stats.warnings.push(`Backup file does not exist for table ${table}`);
      return;
    }

    const fileSizeMB = getFileSizeInMB(filePath);
    console.log(`📥 Reading ${table} (${fileSizeMB.toFixed(2)} MB)`);

    // Parse JSON data
    let records: any[];
    try {
      records = await parseJsonStreaming(filePath);
    } catch (error) {
      console.log(`⚠️  Cannot parse file ${table}.json: ${error}`);
      stats.warnings.push(`Cannot parse backup file for table ${table}`);
      return;
    }

    if (!Array.isArray(records) || records.length === 0) {
      console.log(`⚠️  No data to restore for table ${table}`);
      return;
    }

    console.log(`   📊 Total records: ${records.length.toLocaleString()}`);

    // Get Prisma model
    const modelName = toCamelCase(table);
    const model = (prisma as any)[modelName];

    if (!model || typeof model.createMany !== 'function') {
      console.log(`   🔧 Using raw SQL for ${table}...`);
      await restoreWithRawSQL(table, records);
      return;
    }

    // Determine batch size based on table characteristics
    // Tables with FK constraints need smaller batches
    const tablesWithFKConstraints = [
      // E-commerce with FK relationships
      'ext_detailhoadon',
      'ext_sanphamhoadon',
      'product_images',
      'product_variants',
      // Content with FK relationships
      'comments',
      'likes',
      'post_tags',
      // Tasks with FK relationships
      'task_comments',
      'task_media',
      'task_shares',
      // Affiliate with FK relationships
      'aff_clicks',
      'aff_conversions',
      'aff_payment_requests',
      'aff_campaign_affiliates',
      // LMS with FK relationships (courses → modules → lessons → progress)
      'course_modules',
      'lessons',
      'enrollments',
      'lesson_progress',
      'quizzes',
      'questions',
      'answers',
      // Employee with FK relationships
      'employment_history',
      'employee_documents',
      'onboarding_checklists',
      'offboarding_processes',
      // Pages with FK relationships
      'page_blocks',
      // Website settings with FK to users
      'website_settings',
    ];
    
    const effectiveBatchSize = tablesWithFKConstraints.includes(table)
      ? Math.min(BATCH_SIZE, 100) // Use smaller batches for FK-heavy tables
      : BATCH_SIZE;

    // Process in batches with progress reporting
    let totalInserted = 0;
    let totalSkipped = 0;
    const totalBatches = Math.ceil(records.length / effectiveBatchSize);

    for (let i = 0; i < records.length; i += effectiveBatchSize) {
      const batch = records.slice(i, i + effectiveBatchSize);
      const transformedBatch = batch.map(record => transformRecord(record, table));

      const { inserted, skipped } = await batchInsert(
        model,
        table,
        transformedBatch,
        effectiveBatchSize,
      );

      totalInserted += inserted;
      totalSkipped += skipped;

      // Progress report every 10 batches or at the end
      const currentBatch = Math.floor(i / effectiveBatchSize) + 1;
      if (currentBatch % 10 === 0 || currentBatch === totalBatches) {
        const percent = Math.round((currentBatch / totalBatches) * 100);
        console.log(
          `   📈 Progress: ${currentBatch}/${totalBatches} batches (${percent}%) - ${totalInserted.toLocaleString()} inserted`,
        );
      }

      // Allow event loop to process
      await new Promise(resolve => setImmediate(resolve));
    }

    // Store statistics
    stats.recordsRestored += totalInserted;
    stats.recordsSkipped += totalSkipped;
    stats.tablesProcessed++;
    stats.tableStats.set(table, {
      restored: totalInserted,
      skipped: totalSkipped,
      errors: 0,
    });

    const status = totalSkipped > 0 ? `${totalInserted} inserted, ${totalSkipped} skipped` : `${totalInserted} inserted`;
    console.log(`✅ Table ${table}: ${status}`);

  } catch (error) {
    const errorMsg = `Error restoring table ${table}: ${error}`;
    console.error(`❌ ${errorMsg}`);
    stats.errors.push(errorMsg);
  }
}

/**
 * Restore with raw SQL for tables without Prisma models
 */
async function restoreWithRawSQL(table: string, records: any[]): Promise<void> {
  try {
    const columns = Object.keys(records[0])
      .map(col => `"${col}"`)
      .join(', ');

    let inserted = 0;
    let skipped = 0;

    // Process in batches for better performance
    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE);

      for (const row of batch) {
        try {
          const values = Object.keys(records[0])
            .map((_, idx) => `$${idx + 1}`)
            .join(', ');

          await prisma.$queryRawUnsafe(
            `INSERT INTO "${table}" (${columns}) VALUES (${values}) ON CONFLICT DO NOTHING`,
            ...Object.values(row),
          );
          inserted++;
        } catch (error) {
          skipped++;
        }
      }
    }

    stats.recordsRestored += inserted;
    stats.recordsSkipped += skipped;
    stats.tableStats.set(table, {
      restored: inserted,
      skipped,
      errors: 0,
    });

    console.log(`✅ Table ${table} (raw SQL): ${inserted} inserted`);
  } catch (error) {
    const errorMsg = `Raw SQL insert failed for table ${table}: ${error}`;
    console.log(`⚠️  ${errorMsg}`);
    stats.warnings.push(errorMsg);
  }
}

/**
 * Clean up existing data with optimized batch deletes
 * Uses dynamic model mapping from schema
 */
async function cleanupBeforeRestore(): Promise<void> {
  console.log('🧹 Cleaning up existing data...');

  // Initialize cache first
  getTableToModelMapping();

  // Get all tables from schema in reverse topological order (children first)
  const restorationOrder = buildRestorationOrder();
  const cleanupOrder = [...restorationOrder].reverse(); // Reverse for cleanup

  let totalDeleted = 0;

  for (const table of cleanupOrder) {
    try {
      const modelName = toCamelCase(table);
      const model = (prisma as any)[modelName];

      if (model && typeof model.deleteMany === 'function') {
        const result = await model.deleteMany({});
        const deleted = result.count || 0;
        totalDeleted += deleted;
        if (deleted > 0) {
          console.log(`   🗑️  ${table.padEnd(35)}: ${deleted} records deleted`);
        }
      }
    } catch (error) {
      // Silently skip tables that don't exist or have errors
      // console.log(`   ⚠️  ${table}: ${error}`);
    }
  }

  console.log(`✅ Cleanup completed: ${totalDeleted.toLocaleString()} records deleted\n`);
}

/**
 * Convert camelCase to snake_case
 * Examples: User → user, UserSession → user_session, TaskComment → task_comment
 */
function camelToSnakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')  // Add underscore before uppercase letters
    .toLowerCase()              // Convert to lowercase
    .replace(/^_/, '');         // Remove leading underscore
}

/**
 * Build table-to-model mapping from schema.prisma
 * Returns { 'users': 'user', 'auth_methods': 'authMethod', ... }
 */
function buildTableToModelMapping(): { [tableName: string]: string } {
  try {
    const schemaPath = path.join(__dirname, 'schema.prisma');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    const mapping: { [tableName: string]: string } = {};
    
    // Extract model blocks with their bodies
    const modelBlockRegex = /^model\s+(\w+)\s*\{([^}]*?)\}/gm;
    let match;
    
    while ((match = modelBlockRegex.exec(schemaContent)) !== null) {
      const modelName = match[1];
      const modelBody = match[2];
      
      // Look for @@map directive in the model body
      const mapMatch = modelBody.match(/@@map\s*\(\s*["']([^"']+)["']\s*\)/);
      const tableName = mapMatch ? mapMatch[1] : camelToSnakeCase(modelName);
      
      // Store mapping: table_name → modelName (for Prisma model access)
      mapping[tableName] = modelName;
    }
    
    return mapping;
  } catch (error) {
    console.error('❌ Error building table-to-model mapping from schema:', error);
    return {};
  }
}

/**
 * Get or create the cached table-to-model mapping
 */
function getTableToModelMapping(): { [tableName: string]: string } {
  if (!tableToModelMappingCache) {
    tableToModelMappingCache = buildTableToModelMapping();
    
    if (Object.keys(tableToModelMappingCache).length === 0) {
      console.warn('⚠️  Could not parse schema.prisma, restore may fail for some tables');
    } else {
      console.log(`✅ Loaded model mapping for ${Object.keys(tableToModelMappingCache).length} tables from schema.prisma`);
    }
  }
  
  return tableToModelMappingCache;
}

/**
 * Convert table name to Prisma model name (camelCase)
 * Examples: 
 *   users → user
 *   auth_methods → authMethod
 *   ext_listhoadon → ext_listhoadon (returns as-is from mapping if exists)
 */
function toCamelCase(tableName: string): string {
  // Get mapping from schema
  const mapping = getTableToModelMapping();
  
  if (mapping[tableName]) {
    // Found in schema - return the model name from @prisma/client
    // But Prisma's ClientOptions use lowercase first letter for model access
    const modelName = mapping[tableName];
    return modelName.charAt(0).toLowerCase() + modelName.slice(1);
  }
  
  // Fallback: use hardcoded mappings for edge cases
  const legacyMappings: { [key: string]: string } = {
    'Hoadon': 'hoadon',
    'HoadonChitiet': 'hoadonChitiet',
    'Page': 'page',
    'PageBlock': 'pageBlock',
    'UserMfaSettings': 'userMfaSettings',
    'UserDevice': 'userDevice',
    'SecurityEvent': 'securityEvent',
    'Role': 'role',
    'Permission': 'permission',
    'RolePermission': 'rolePermission',
    'UserRoleAssignment': 'userRoleAssignment',
    'UserPermission': 'userPermission',
    'ResourceAccess': 'resourceAccess',
  };
  
  if (legacyMappings[tableName]) {
    return legacyMappings[tableName];
  }
  
  // Final fallback: convert table name using snake_case reverse
  // users → user, auth_methods → authMethod
  return convertSnakeCaseToCamelCase(tableName);
}

/**
 * Convert snake_case to camelCase
 * Examples: user → user, auth_methods → authMethod, task_comments → taskComments
 */
function convertSnakeCaseToCamelCase(str: string): string {
  return str.toLowerCase().replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Build dependency-aware restoration order from schema
 */
function buildRestorationOrder(): string[] {
  try {
    const schemaPath = path.join(__dirname, 'schema.prisma');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Extract all model names
    const modelBlockRegex = /^model\s+(\w+)\s*\{([^}]*?)\}/gm;
    const models: { modelName: string; tableName: string; dependencies: string[] }[] = [];
    let match;
    
    while ((match = modelBlockRegex.exec(schemaContent)) !== null) {
      const modelName = match[1];
      const modelBody = match[2];
      
      // Get table name from @@map or convert from model name
      const mapMatch = modelBody.match(/@@map\s*\(\s*["']([^"']+)["']\s*\)/);
      const tableName = mapMatch ? mapMatch[1] : camelToSnakeCase(modelName);
      
      // Find all @relation references to determine dependencies
      const relationMatches = modelBody.match(/@relation\([^)]*\)/g) || [];
      const dependencies: string[] = [];
      
      for (const relation of relationMatches) {
        // Extract model references from relations
        const refMatch = relation.match(/(?:to:\s*)?(\w+)(?:\s*,|\s*\))/);
        if (refMatch && refMatch[1] !== modelName) {
          dependencies.push(refMatch[1]);
        }
      }
      
      models.push({ modelName, tableName, dependencies });
    }
    
    // Topological sort - models with no dependencies first, then dependents
    const sorted: string[] = [];
    const visited = new Set<string>();
    
    function visit(modelName: string): void {
      if (visited.has(modelName)) return;
      visited.add(modelName);
      
      const model = models.find(m => m.modelName === modelName);
      if (!model) return;
      
      // Visit dependencies first
      for (const dep of model.dependencies) {
        const depModel = models.find(m => m.modelName === dep);
        if (depModel && !visited.has(dep)) {
          visit(dep);
        }
      }
      
      sorted.push(model.tableName);
    }
    
    // Start with models that have no dependencies
    for (const model of models) {
      if (model.dependencies.length === 0) {
        visit(model.modelName);
      }
    }
    
    // Then visit remaining models
    for (const model of models) {
      visit(model.modelName);
    }
    
    console.log(`✅ Built restoration order for ${sorted.length} models from schema`);
    return sorted;
  } catch (error) {
    console.error('❌ Error building restoration order:', error);
    // Fallback to hardcoded order if schema parsing fails
    return [
      // Core users & auth
      'users', 'auth_methods', 'user_sessions', 'verification_tokens',
      // Audit logs
      'audit_logs',
      // Website settings (depends on users for createdBy/updatedBy FK)
      'website_settings',
      // Core content
      'posts', 'tags', 'post_tags', 'comments', 'likes', 'notifications',
      // Tasks
      'tasks', 'task_comments', 'task_media', 'task_shares',
      // AI/Chat
      'chatbot_models', 'training_data', 'chat_conversations', 'chat_messages',
      // Affiliate system
      'aff_users', 'aff_campaigns', 'aff_campaign_affiliates', 'aff_links', 'aff_clicks', 'aff_conversions', 'aff_payment_requests',
      // Employee management
      'employee_profiles', 'employment_history', 'employee_documents', 'onboarding_checklists', 'offboarding_processes',
      // E-commerce
      'categories', 'products', 'product_images', 'product_variants',
      // Invoice system
      'ext_listhoadon', 'ext_detailhoadon', 'ext_sanphamhoadon',
      // Pages & Menu
      'pages', 'page_blocks', 'menus',
      // LMS - Courses
      'course_categories', 'courses', 'course_modules', 'lessons', 'enrollments', 'lesson_progress',
      // LMS - Quizzes & Learning
      'quizzes', 'questions', 'answers',
      // Reviews
      'reviews',
    ];
  }
}

/**
 * Get list of tables to restore in proper dependency order
 */
async function getTablesToRestore(backupFolder: string): Promise<string[]> {
  try {
    const backupPath = path.join(BACKUP_ROOT_DIR, backupFolder);
    
    if (!fs.existsSync(backupPath)) {
      console.error(`❌ Backup folder not found: ${backupPath}`);
      return [];
    }
    
    // Get all backup files
    const allFiles = fs.readdirSync(backupPath)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''));

    // Get schema-based restoration order
    const restorationOrder = buildRestorationOrder();

    // Sort files according to restoration order
    const sortedFiles = restorationOrder.filter(table => allFiles.includes(table));
    
    // Add any remaining files not in the order list
    const remaining = allFiles.filter(f => !sortedFiles.includes(f));
    const finalOrder = [...sortedFiles, ...remaining.sort()];

    console.log(`📋 Found ${finalOrder.length} backup files`);
    console.log(`📊 Restoration order optimized based on schema dependencies\n`);
    return finalOrder;
  } catch (error) {
    console.error(`❌ Error reading backup folder: ${error}`);
    return [];
  }
}

/**
 * Print final statistics
 */
function printFinalStats(): void {
  const duration = Math.round((Date.now() - stats.startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  console.log('\n' + '='.repeat(70));
  console.log('📊 RESTORE PROCESS COMPLETED');
  console.log('='.repeat(70));
  console.log(`📂 Backup folder: ${stats.backupFolder || 'N/A'}`);
  console.log(`✅ Tables processed: ${stats.tablesProcessed}`);
  console.log(`📝 Total records restored: ${stats.recordsRestored.toLocaleString()}`);
  console.log(`⏭️  Records skipped: ${stats.recordsSkipped.toLocaleString()}`);
  console.log(`⏱️  Duration: ${minutes}m ${seconds}s`);
  console.log(`⚠️  Warnings: ${stats.warnings.length}`);
  console.log(`❌ Errors: ${stats.errors.length}`);

  if (stats.tableStats.size > 0) {
    console.log('\n📋 Table Statistics:');
    for (const [table, data] of Array.from(stats.tableStats.entries()).sort()) {
      const total = data.restored + data.skipped;
      const percent = total > 0 ? Math.round((data.restored / total) * 100) : 0;
      console.log(
        `   ${table.padEnd(25)} | Restored: ${data.restored.toString().padStart(6)} | Skipped: ${data.skipped.toString().padStart(6)} | Success: ${percent}%`,
      );
    }
  }

  if (stats.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    stats.warnings.slice(0, 5).forEach((warning, i) => {
      console.log(`   ${i + 1}. ${warning.substring(0, 80)}`);
    });
    if (stats.warnings.length > 5) {
      console.log(`   ... and ${stats.warnings.length - 5} more warnings`);
    }
  }

  if (stats.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    stats.errors.slice(0, 3).forEach((error, i) => {
      console.log(`   ${i + 1}. ${error.substring(0, 80)}`);
    });
    if (stats.errors.length > 3) {
      console.log(`   ... and ${stats.errors.length - 3} more errors`);
    }
  }

  console.log('='.repeat(70));

  // Success indicator
  if (stats.errors.length === 0) {
    console.log('✅ Restore completed successfully!\n');
  } else {
    console.log('⚠️  Restore completed with some errors (see above)\n');
  }
}

/**
 * Main restore function
 */
async function main(): Promise<void> {
  console.log('🚀 STARTING OPTIMIZED rausachcore DATA RESTORE');
  console.log(`⏰ Start time: ${new Date().toLocaleString()}`);
  console.log(`⚙️  Batch size: ${BATCH_SIZE.toLocaleString()} records`);
  console.log(`💾 Backup root: ${BACKUP_ROOT_DIR}\n`);

  try {
    const backupFolder = getLatestBackupFolder();
    if (!backupFolder) {
      throw new Error('No backup folder found');
    }

    stats.backupFolder = backupFolder;
    console.log(`📂 Using backup: ${backupFolder}\n`);

    // Step 1: Cleanup
    await cleanupBeforeRestore();

    // Step 2: Get tables to restore
    const tables = await getTablesToRestore(backupFolder);
    if (tables.length === 0) {
      throw new Error('No backup files found');
    }

    // Step 3: Restore tables
    console.log(`🔄 Restoring ${tables.length} tables...\n`);
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      console.log(`[${i + 1}/${tables.length}] Restoring: ${table}`);
      await restoreTableOptimized(table, backupFolder);
      console.log('');
    }

  } catch (error) {
    console.error(`❌ Unexpected error: ${error}`);
    stats.errors.push(String(error));
  }

  // Print final statistics
  printFinalStats();
}

// Run the restore
main()
  .catch((err) => {
    console.error('❌ Critical error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
