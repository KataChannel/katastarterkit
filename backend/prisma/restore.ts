import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const BACKUP_ROOT_DIR = './kata_json';

/**
 * Parse schema.prisma file to extract all model names and their table mappings
 */
function parseSchemaModels(): { modelName: string; tableName: string }[] {
  try {
    const schemaPath = path.join(__dirname, 'schema.prisma');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    // Extract model blocks using regex
    const modelBlockRegex = /^model\s+(\w+)\s*\{([^}]*)\}/gm;
    const models: { modelName: string; tableName: string }[] = [];
    let match;
    
    while ((match = modelBlockRegex.exec(schemaContent)) !== null) {
      const modelName = match[1];
      const modelBody = match[2];
      
      // Look for @@map directive in the model body
      const mapMatch = modelBody.match(/@@map\s*\(\s*["']([^"']+)["']\s*\)/);
      const tableName = mapMatch ? mapMatch[1] : convertModelToTableName(modelName);
      
      models.push({ modelName, tableName });
    }
    
    console.log(`📋 Found ${models.length} models in schema.prisma:`);
    console.log(`   ${models.map(m => `${m.modelName} → ${m.tableName}`).join(', ')}`);
    return models;
  } catch (error) {
    console.error('❌ Error parsing schema.prisma:', error);
    return [];
  }
}

/**
 * Convert Prisma model names to database table names
 * Based on Prisma's naming conventions and @@map directives
 */
function convertModelToTableName(modelName: string): string {
  // Handle special cases where model name != table name (snake_case conversion)
  const specialMappings: { [key: string]: string } = {
    'User': 'users',
    'AuthMethod': 'auth_methods',
    'VerificationToken': 'verification_tokens', 
    'UserSession': 'user_sessions',
    'AuditLog': 'audit_logs',
    'Post': 'posts',
    'Comment': 'comments',
    'Tag': 'tags',
    'Like': 'likes',
    'PostTag': 'post_tags',
    'Notification': 'notifications',
    'Task': 'tasks',
    'TaskComment': 'task_comments',
    'TaskMedia': 'task_media',
    'TaskShare': 'task_shares',
    'ChatbotModel': 'chatbot_models',
    'TrainingData': 'training_data',
    'ChatConversation': 'chat_conversations',
    'ChatMessage': 'chat_messages',
    'Page': 'Page',
    'PageBlock': 'PageBlock', 
    'UserMfaSettings': 'UserMfaSettings',
    'UserDevice': 'UserDevice',
    'SecurityEvent': 'SecurityEvent',
    'Role': 'Role',
    'Permission': 'Permission',
    'RolePermission': 'RolePermission',
    'UserRoleAssignment': 'UserRoleAssignment',
    'UserPermission': 'UserPermission',
    'ResourceAccess': 'ResourceAccess',
    'Menu': 'menus',
    'AffUser': 'aff_users',
    'AffCampaign': 'aff_campaigns',
    'AffCampaignAffiliate': 'aff_campaign_affiliates',
    'AffLink': 'aff_links',
    'AffClick': 'aff_clicks',
    'AffConversion': 'aff_conversions',
    'AffPaymentRequest': 'aff_payment_requests',
    'EmployeeProfile': 'employee_profiles',
    'EmploymentHistory': 'employment_history',
    'EmployeeDocument': 'employee_documents',
    'OnboardingChecklist': 'onboarding_checklists',
    'OffboardingProcess': 'offboarding_processes',
    'Category': 'categories',
    'Product': 'products',
    'ProductImage': 'product_images',
    'ProductVariant': 'product_variants',
  };
  
  // Return mapped name or original name for models that match table names exactly
  return specialMappings[modelName] || modelName;
}

/**
 * Check if a table exists in the database
 */
async function tableExists(tableName: string): Promise<boolean> {
  try {
    await prisma.$queryRawUnsafe(`SELECT 1 FROM "${tableName}" LIMIT 1`);
    return true;
  } catch (error: any) {
    // Check for table not exists error codes
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      return false;
    }
    // For other errors (like empty table), assume table exists
    return true;
  }
}

/**
 * Get list of existing tables from database
 */
async function getExistingTables(): Promise<string[]> {
  try {
    const result: any[] = await prisma.$queryRaw`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    return result.map(row => row.tablename);
  } catch (error) {
    console.error('❌ Error getting existing tables:', error);
    return [];
  }
}

interface RestoreStats {
  tablesProcessed: number;
  recordsRestored: number;
  errors: string[];
  warnings: string[];
  backupFolder?: string;
}

const stats: RestoreStats = {
  tablesProcessed: 0,
  recordsRestored: 0,
  errors: [],
  warnings: []
};

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

async function cleanupBeforeRestore(): Promise<void> {
  console.log('🧹 Cleaning up existing data before restore...');
  
  try {
    // Delete in reverse dependency order to avoid FK constraint issues
    // Using dynamic table detection but with safe cleanup order
    const availableTables = await getTables();
    const cleanupOrder = [
      // Dependencies first (child → parent)
      'ext_detailhoadon', 'ext_listhoadon',
      'HoadonChitiet', 'Hoadon',
      'chat_messages', 'chat_conversations', 'training_data', 'chatbot_models',
      'task_shares', 'task_media', 'task_comments', 'tasks',
      'post_tags', 'likes', 'comments', 'posts', 'notifications', 'tags',
      'RolePermission', 'UserRoleAssignment', 'UserPermission', 'ResourceAccess',
      'Permission', 'Role', 'SecurityEvent', 'UserDevice', 'UserMfaSettings',
      'PageBlock', 'Page',
      'audit_logs', 'user_sessions', 'verification_tokens', 'auth_methods', 'users'
    ].filter(table => availableTables.includes(table)); // Only cleanup tables that exist
    
    console.log(`🧹 Cleanup order: ${cleanupOrder.join(' → ')}`);
    
    let totalDeleted = 0;
    for (const table of cleanupOrder) {
      try {
        const model = (prisma as any)[table];
        if (model && typeof model.deleteMany === 'function') {
          const result = await model.deleteMany({});
          const deleted = result.count || 0;
          totalDeleted += deleted;
          if (deleted > 0) {
            console.log(`   🗑️  Deleted ${deleted} records from ${table}`);
          }
        }
      } catch (error) {
        console.log(`⚠️  Cannot delete from ${table} - Skipping`);
        stats.warnings.push(`Cannot delete from ${table}: ${error}`);
      }
    }
    
    console.log(`✅ Cleanup completed: ${totalDeleted} records deleted`);
  } catch (error) {
    console.error(`⚠️ Error during cleanup: ${error}`);
    stats.warnings.push(`Error during cleanup: ${error}`);
  }
}


// Helper function to convert table name to camelCase for Prisma model
/**
 * Get all tables that should be restored
 */
async function getTables(): Promise<string[]> {
  console.log('🔍 Parsing schema.prisma to get all models...');
  const models = parseSchemaModels();
  
  if (models.length === 0) {
    console.log('⚠️  No models found in schema.prisma, using fallback list');
    // Fallback to manual list if parsing fails
    return [
      'users', 'auth_methods', 'verification_tokens', 'user_sessions', 'audit_logs',
      'posts', 'comments', 'tags', 'likes', 'post_tags', 'notifications',
      'tasks', 'task_comments', 'task_media', 'task_shares',
      'chatbot_models', 'training_data', 'chat_conversations', 'chat_messages',
      'Hoadon', 'HoadonChitiet',
      'ext_listhoadon', 'ext_detailhoadon'
    ];
  }
  
  const allTableNames = models.map(model => model.tableName);
  console.log(`🗂️  Parsed ${allTableNames.length} table names from schema`);
  
  // Get existing tables from database
  console.log('🔍 Checking which tables actually exist in database...');
  const existingTables = await getExistingTables();
  console.log(`📋 Found ${existingTables.length} existing tables in database`);
  
  // Filter to only include tables that exist
  const validTables = allTableNames.filter(tableName => {
    const exists = existingTables.includes(tableName);
    if (!exists) {
      console.log(`   ⚠️  Table '${tableName}' from schema not found in database`);
    }
    return exists;
  });
  
  console.log(`✅ Final table list for restore (${validTables.length} tables):`);
  console.log(`   ${validTables.join(', ')}`);
  return validTables;
}

function toCamelCase(tableName: string): string {
  const mapping: { [key: string]: string } = {
    'users': 'user', 'auth_methods': 'authMethod', 'verification_tokens': 'verificationToken',
    'user_sessions': 'userSession', 'audit_logs': 'auditLog', 'posts': 'post',
    'comments': 'comment', 'tags': 'tag', 'likes': 'like', 'post_tags': 'postTag',
    'notifications': 'notification', 'tasks': 'task', 'task_comments': 'taskComment',
    'task_media': 'taskMedia', 'task_shares': 'taskShare', 'chatbot_models': 'chatbotModel',
    'training_data': 'trainingData', 'chat_conversations': 'chatConversation',
    'chat_messages': 'chatMessage', 'Hoadon': 'hoadon', 'HoadonChitiet': 'hoadonChitiet',
    'Page': 'page', 'PageBlock': 'pageBlock', 'UserMfaSettings': 'userMfaSettings',
    'UserDevice': 'userDevice', 'SecurityEvent': 'securityEvent',
    'Role': 'role', 'Permission': 'permission', 'RolePermission': 'rolePermission',
    'UserRoleAssignment': 'userRoleAssignment', 'UserPermission': 'userPermission',
    'ResourceAccess': 'resourceAccess', 'ext_listhoadon': 'ext_listhoadon', 
    'ext_detailhoadon': 'ext_detailhoadon', 'menus': 'menu',
    'aff_users': 'affUser', 'aff_campaigns': 'affCampaign', 
    'aff_campaign_affiliates': 'affCampaignAffiliate', 'aff_links': 'affLink',
    'aff_clicks': 'affClick', 'aff_conversions': 'affConversion',
    'aff_payment_requests': 'affPaymentRequest', 'employee_profiles': 'employeeProfile',
    'employment_history': 'employmentHistory', 'employee_documents': 'employeeDocument',
    'onboarding_checklists': 'onboardingChecklist', 'offboarding_processes': 'offboardingProcess',
    'categories': 'category', 'products': 'product', 'product_images': 'productImage',
    'product_variants': 'productVariant'
  };
  
  return mapping[tableName] || tableName;
}

async function restoreTableFromJson(table: string, backupFolder: string): Promise<void> {
  try {
    const filePath = path.join(BACKUP_ROOT_DIR, backupFolder, `${table}.json`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Backup file not found for table ${table}, skipping.`);
      stats.warnings.push(`Backup file does not exist for table ${table}`);
      return;
    }
    
    // Check if table exists in database
    const exists = await tableExists(table);
    if (!exists) {
      console.log(`⚠️  Table ${table} does not exist in database, skipping...`);
      stats.warnings.push(`Table ${table} does not exist in database`);
      return;
    }
    
    console.log(`📥 Reading data for table: ${table}`);
    let rawData: any[];
    
    try {
      rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
      console.log(`⚠️ Cannot read file ${table}.json: ${error} - Skipping`);
      stats.warnings.push(`Cannot read backup file for table ${table}`);
      return;
    }
    
    if (!Array.isArray(rawData) || rawData.length === 0) {
      console.log(`⚠️  Table ${table} has no data to restore`);
      return;
    }
    
    // Clean data - convert date strings to Date objects
    const processedData = rawData.map(item => {
      const newItem = { ...item };
      ['createdAt', 'updatedAt', 'publishedAt', 'completedAt', 'dueDate', 
       'processedAt', 'expiresAt', 'lastLoginAt', 'lockedUntil'].forEach(field => {
        if (newItem[field] && typeof newItem[field] === 'string') {
          newItem[field] = new Date(newItem[field]);
        }
      });
      return newItem;
    });

    // Check if Prisma model exists
    const model = (prisma as any)[toCamelCase(table)];
    if (!model || typeof model.createMany !== 'function') {
      console.log(`🔧 Table ${table} has no Prisma model, using raw SQL...`);
      await restoreWithRawSQL(table, processedData);
      return;
    }

    // Try batch insert first
    try {
      console.log(`⏳ Restoring ${processedData.length} records for table ${table}...`);
      
      await model.createMany({
        data: processedData,
        skipDuplicates: true,
      });
      
      stats.recordsRestored += processedData.length;
      console.log(`✅ Inserted ${processedData.length} records into table ${table}`);
      
    } catch (batchError: any) {
      console.log(`⚠️  Batch insert failed for table ${table}: ${batchError.message}`);
      console.log(`🔄 Trying individual record insertion...`);
      await restoreRecordsIndividually(model, table, processedData);
    }
    
    stats.tablesProcessed++;
    
  } catch (error) {
    const errorMsg = `Error restoring table ${table}: ${error}`;
    console.error(`⚠️ ${errorMsg} - Skipping and continuing`);
    stats.warnings.push(errorMsg);
  }
}


async function restoreWithRawSQL(table: string, data: any[]): Promise<void> {
  try {
    const columns = Object.keys(data[0]).map((col) => `"${col}"`).join(', ');
    let totalInserted = 0;
    
    for (const row of data) {
      try {
        const values = Object.values(row).map((_, idx) => `$${idx + 1}`).join(', ');
        await prisma.$queryRawUnsafe(
          `INSERT INTO "${table}" (${columns}) VALUES (${values}) ON CONFLICT DO NOTHING`,
          ...Object.values(row)
        );
        totalInserted++;
      } catch (error) {
        console.log(`⚠️ Row insert error for ${table} - Skipping row`);
      }
    }
    
    stats.recordsRestored += totalInserted;
    console.log(`✅ Inserted ${totalInserted} records into table ${table} (raw SQL)`);
    
  } catch (error) {
    console.log(`⚠️ Raw SQL insert failed for table ${table}: ${error}`);
    stats.warnings.push(`Raw SQL insert failed for table ${table}`);
  }
}

async function restoreRecordsIndividually(model: any, table: string, data: any[]): Promise<void> {
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < data.length; i++) {
    try {
      await model.create({ data: data[i] });
      successCount++;
      
      if (i % 100 === 0 && i > 0) {
        console.log(`   📊 Progress: ${i}/${data.length} records processed`);
      }
      
    } catch (recordError: any) {
      errorCount++;
      if (errorCount <= 5) {
        console.log(`   ⚠️  Record ${i} error: ${recordError.message}`);
      }
    }
  }
  
  stats.recordsRestored += successCount;
  console.log(`✅ Table ${table}: ${successCount} successful, ${errorCount} errors (skipped)`);
  
  if (errorCount > 0) {
    stats.warnings.push(`Table ${table}: ${errorCount} records could not be restored`);
  }
}

async function restoreAllTablesFromJson(): Promise<void> {
  const backupFolder = getLatestBackupFolder();
  if (!backupFolder) {
    console.error('❌ No backup folder found!');
    stats.errors.push('No backup folder found');
    return;
  }
  
  stats.backupFolder = backupFolder;
  console.log(`📂 Restoring from folder: ${backupFolder}`);
  console.log(`📁 Full path: ${path.join(BACKUP_ROOT_DIR, backupFolder)}`);
  
  const tables = await getTables();
  console.log(`📊 Found ${tables.length} tables to restore.`);
  console.log(`🔄 Will restore ${tables.length} tables in dependency order`);
  
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    console.log(`\n[${i + 1}/${tables.length}] Restoring table: ${table}`);
    await restoreTableFromJson(table, backupFolder);
  }
}


function printFinalStats(): void {
  console.log('\n' + '='.repeat(60));
  console.log('📊 KATACORE RESTORE RESULTS');
  console.log('='.repeat(60));
  console.log(`📂 Backup folder: ${stats.backupFolder || 'N/A'}`);
  console.log(`✅ Tables processed: ${stats.tablesProcessed}`);
  console.log(`📝 Total records restored: ${stats.recordsRestored.toLocaleString()}`);
  console.log(`⚠️  Warnings: ${stats.warnings.length}`);
  console.log(`❌ Errors: ${stats.errors.length}`);
  
  if (stats.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    stats.warnings.slice(0, 10).forEach((warning, i) => {
      console.log(`   ${i + 1}. ${warning}`);
    });
    if (stats.warnings.length > 10) {
      console.log(`   ... and ${stats.warnings.length - 10} more warnings`);
    }
  }
  
  if (stats.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    stats.errors.slice(0, 5).forEach((error, i) => {
      console.log(`   ${i + 1}. ${error}`);
    });
    if (stats.errors.length > 5) {
      console.log(`   ... and ${stats.errors.length - 5} more errors`);
    }
  }
  
  console.log('='.repeat(60));
}

async function main(): Promise<void> {
  const startTime = Date.now();
  console.log('🚀 STARTING KATACORE DATA RESTORE PROCESS');
  console.log(`⏰ Start time: ${new Date().toLocaleString()}`);
  console.log('📌 Mode: Skip errors and continue processing');
  
  try {
    // Step 1: Clean up existing data
    await cleanupBeforeRestore();
    
    // Step 2: Restore data in proper order
    await restoreAllTablesFromJson();
    
  } catch (error) {
    console.error(`⚠️ Unexpected error in restore process: ${error}`);
    stats.warnings.push(`Main process error: ${error}`);
  }
  
  const duration = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n🎉 RESTORE COMPLETED! (${duration}s)`);
  printFinalStats();
}

main()
  .then(() => {
    if (stats.warnings.length === 0 && stats.errors.length === 0) {
      console.log('\n✅ Restore process completed successfully!');
    } else {
      console.log('\n⚠️  Restore completed with some warnings/errors that were skipped!');
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error('⚠️ Process error:', err);
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());

