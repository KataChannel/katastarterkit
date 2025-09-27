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

async function getTables(): Promise<string[]> {
  // Return all table names from the current schema based on Prisma models
  return [
    // User system tables
    'users',
    'auth_methods', 
    'verification_tokens',
    'user_sessions',
    'audit_logs',
    
    // Content system tables
    'posts',
    'comments',
    'tags',
    'likes',
    'post_tags',
    'notifications',
    
    // Task system tables
    'tasks',
    'task_comments',
    'task_media',
    'task_shares',
    
    // AI/Chatbot system tables
    'chatbot_models',
    'training_data',
    'chat_conversations',
    'chat_messages',
    
    // Invoice system tables
    'Hoadon',
    'HoadonChitiet',
    'ext_listhoadon',
    'ext_detailhoadon'
  ];
}

async function backupTableToJson(table: string): Promise<void> {
  try {
    console.log(`🔄 Backing up table: ${table}`);
    const data: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM "${table}"`);
    
    if (data.length === 0) {
      console.log(`⚠️  Table ${table} is empty, skipping...`);
      return;
    }
    
    const filePath: string = path.join(BACKUP_DIR, `${table}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ Backup JSON successful: ${filePath} (${data.length} records)`);
  } catch (error) {
    console.error(`❌ Error backing up table ${table}:`, error);
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
  .then(() => console.log('🎉 KataCore backup completed successfully!'))
  .catch((err) => console.error('❌ Backup error:', err))
  .finally(() => prisma.$disconnect());

// To restore data, uncomment and run restoreAllTablesFromJson()
// restoreAllTablesFromJson()
//   .then(() => console.log('🎉 KataCore restore completed successfully!'))
//   .catch((err) => console.error('❌ Restore error:', err))
//   .finally(() => prisma.$disconnect());
