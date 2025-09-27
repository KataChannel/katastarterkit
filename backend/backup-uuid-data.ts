import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function createBackupWithUUIDs() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const backupDir = path.join(__dirname, 'kata_json', `${timestamp}_uuid_backup`);
  
  // Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  console.log(`📦 Creating backup with UUIDs at: ${backupDir}`);
  
  try {
    // Backup Users
    const users = await prisma.user.findMany();
    fs.writeFileSync(
      path.join(backupDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    console.log(`✅ Backed up ${users.length} users`);
    
    // Backup Tasks
    const tasks = await prisma.task.findMany();
    fs.writeFileSync(
      path.join(backupDir, 'tasks.json'),
      JSON.stringify(tasks, null, 2)
    );
    console.log(`✅ Backed up ${tasks.length} tasks`);
    
    // Backup Auth Methods
    const authMethods = await prisma.authMethod.findMany();
    fs.writeFileSync(
      path.join(backupDir, 'auth_methods.json'),
      JSON.stringify(authMethods, null, 2)
    );
    console.log(`✅ Backed up ${authMethods.length} auth methods`);
    
    // Backup Audit Logs
    const auditLogs = await prisma.auditLog.findMany();
    fs.writeFileSync(
      path.join(backupDir, 'audit_logs.json'),
      JSON.stringify(auditLogs, null, 2)
    );
    console.log(`✅ Backed up ${auditLogs.length} audit logs`);
    
    // Check and backup other tables if they have data
    const additionalTables = [
      { name: 'posts', model: prisma.post },
      { name: 'comments', model: prisma.comment },
      { name: 'tags', model: prisma.tag },
      { name: 'likes', model: prisma.like },
      { name: 'notifications', model: prisma.notification },
      { name: 'task_comments', model: prisma.taskComment },
      { name: 'task_media', model: prisma.taskMedia },
      { name: 'task_shares', model: prisma.taskShare },
      { name: 'chatbot_models', model: prisma.chatbotModel },
      { name: 'training_data', model: prisma.trainingData },
      { name: 'chat_conversations', model: prisma.chatConversation },
      { name: 'chat_messages', model: prisma.chatMessage },
      { name: 'hoadon', model: prisma.hoadon },
      { name: 'hoadon_chitiet', model: prisma.hoadonChitiet },
      { name: 'ext_listhoadon', model: prisma.ext_listhoadon },
      { name: 'ext_detailhoadon', model: prisma.ext_detailhoadon }
    ];
    
    for (const table of additionalTables) {
      try {
        const data = await table.model.findMany();
        if (data.length > 0) {
          fs.writeFileSync(
            path.join(backupDir, `${table.name}.json`),
            JSON.stringify(data, null, 2)
          );
          console.log(`✅ Backed up ${data.length} ${table.name}`);
        }
      } catch (error) {
        console.log(`⚠️  Skipped ${table.name} (table might be empty or have issues)`);
      }
    }
    
    // Create backup summary
    const summary = {
      timestamp: new Date().toISOString(),
      format: 'UUID',
      description: 'Backup after converting all CUIDs to UUIDs',
      tables: {
        users: users.length,
        tasks: tasks.length,
        auth_methods: authMethods.length,
        audit_logs: auditLogs.length
      }
    };
    
    fs.writeFileSync(
      path.join(backupDir, 'backup_summary.json'),
      JSON.stringify(summary, null, 2)
    );
    
    console.log('\n🎉 Backup completed successfully!');
    console.log(`📁 Backup location: ${backupDir}`);
    console.log('📋 This backup contains data with UUID format IDs');
    
  } catch (error) {
    console.error('❌ Error creating backup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  createBackupWithUUIDs().catch(console.error);
}