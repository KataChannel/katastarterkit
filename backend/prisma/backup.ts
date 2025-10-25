import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const BACKUP_ROOT_DIR = './kata_json';

function getFormattedDate(): string {
  const now = new Date();
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

const BACKUP_DIR = path.join(BACKUP_ROOT_DIR, getFormattedDate());

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
    // Fallback to empty array if parsing fails
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
    'ResourceAccess': 'ResourceAccess'
  };
  
  // Return mapped name or original name for models that match table names exactly
  return specialMappings[modelName] || modelName;
}

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
  
  console.log(`✅ Final table list (${validTables.length} tables):`);
  console.log(`   ${validTables.join(', ')}`);
  return validTables;
}

async function backupTableToJson(table: string): Promise<void> {
  try {
    console.log(`🔄 Backing up table: ${table}`);
    
    // Check if table exists first
    const exists = await tableExists(table);
    if (!exists) {
      console.log(`⚠️  Table ${table} does not exist in database, skipping...`);
      return;
    }
    
    const data: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "${table}"`);
    
    if (data.length === 0) {
      console.log(`⚠️  Table ${table} is empty, skipping...`);
      return;
    }
    
    const filePath: string = path.join(BACKUP_DIR, `${table}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Backup JSON successful: ${filePath} (${data.length} records)`);
  } catch (error: any) {
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      console.log(`⚠️  Table ${table} does not exist in database, skipping...`);
    } else {
      console.error(`❌ Error backing up table ${table}:`, error.message || error);
    }
  }
}

async function backupAllTablesToJson(): Promise<void> {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  console.log(`📂 Creating backup in directory: ${BACKUP_DIR}`);
  console.log(`⏰ Backup started at: ${new Date().toLocaleString()}`);
  
  const tables: string[] = await getTables();
  console.log(`📊 Found ${tables.length} tables to backup`);
  
  let totalRecords = 0;
  const startTime = Date.now();
  
  for (const table of tables) {
    const tableStartTime = Date.now();
    await backupTableToJson(table);
    
    // Count records for statistics
    try {
      const recordCount: any[] = await prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM "${table}"`);
      const count = parseInt(recordCount[0].count);
      totalRecords += count;
      
      const tableTime = Date.now() - tableStartTime;
      if (count > 0) {
        console.log(`   📈 ${count.toLocaleString()} records in ${tableTime}ms`);
      }
    } catch (e) {
      console.log(`   ⚠️  Could not count records for ${table}`);
    }
  }
  
  const totalTime = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n🎉 Backup completed successfully!`);
  console.log(`📊 Total records: ${totalRecords.toLocaleString()}`);
  console.log(`⏱️  Total time: ${totalTime} seconds`);
  console.log(`📁 Backup location: ${BACKUP_DIR}`);
}

async function restoreTableFromJson(table: string): Promise<void> {
  try {
    const latestBackupDir = fs.readdirSync(BACKUP_ROOT_DIR).sort().reverse()[0];
    if (!latestBackupDir) {
      console.error(`❌ No backup directory found.`);
      return;
    }
    
    const filePath: string = path.join(BACKUP_ROOT_DIR, latestBackupDir, `${table}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Backup file not found for table ${table}`);
      return;
    }

    console.log(`📥 Restoring table: ${table}`);
    const data: any[] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (data.length === 0) {
      console.log(`⚠️  No data to restore for table ${table}`);
      return;
    }
    
    // Use batch insert with ON CONFLICT handling
    const columns = Object.keys(data[0]).map(col => `"${col}"`).join(', ');
    const placeholders = Object.keys(data[0]).map((_, i) => `$${i + 1}`).join(', ');
    
    let successCount = 0;
    for (const row of data) {
      try {
        await prisma.$queryRawUnsafe(
          `INSERT INTO "${table}" (${columns}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
          ...Object.values(row)
        );
        successCount++;
      } catch (error) {
        console.log(`⚠️  Skipped duplicate/invalid record in ${table}`);
      }
    }
    
    console.log(`✅ Successfully restored ${successCount}/${data.length} records to table ${table}`);
  } catch (error) {
    console.error(`❌ Error restoring table ${table}:`, error);
  }
}

async function restoreAllTablesFromJson(): Promise<void> {
  console.log(`🔄 Starting restore process...`);
  
  const tables: string[] = await getTables();
  console.log(`📊 Found ${tables.length} tables to restore`);
  
  const startTime = Date.now();
  let totalRestored = 0;
  
  for (const table of tables) {
    const tableStartTime = Date.now();
    await restoreTableFromJson(table);
    
    const tableTime = Date.now() - tableStartTime;
    console.log(`   ⏱️  ${table}: ${tableTime}ms`);
  }
  
  const totalTime = Math.round((Date.now() - startTime) / 1000);
  console.log(`\n🎉 Restore completed in ${totalTime} seconds!`);
}

backupAllTablesToJson()
  .then(() => console.log('🎉 rausachcore backup completed successfully!'))
  .catch((err) => console.error('❌ Backup error:', err))
  .finally(() => prisma.$disconnect());

// To restore data, uncomment and run restoreAllTablesFromJson()
// restoreAllTablesFromJson()
//   .then(() => console.log('🎉 rausachcore restore completed successfully!'))
//   .catch((err) => console.error('❌ Restore error:', err))
//   .finally(() => prisma.$disconnect());
