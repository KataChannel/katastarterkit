/**
 * Backup Utilities - Common functions for backup/restore operations
 * Optimized for multi-domain environment (rausach, tazagroup, timona)
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

// =====================================================
// CONFIGURATION
// =====================================================

export interface BackupConfig {
  domain: string;
  backupDir: string;
  maxBackups: number;
  compressionEnabled: boolean;
  excludeTables: string[];
  priorityTables: string[];
}

// Tables that should ALWAYS be backed up (critical data)
export const PRIORITY_TABLES = [
  // User & Auth
  'users',
  'auth_methods',
  'user_sessions',
  'roles',
  'permissions',
  'role_permissions',
  'user_role_assignments',
  
  // System Config
  'website_settings',
  'menus',
  
  // Core Business Data - E-commerce
  'categories',
  'products',
  'product_images',
  'product_variants',
  'orders',
  'order_items',
  'payments',
  
  // Blog & Content
  'blog_categories',
  'blog_tags', 
  'blog_posts',
  'blog_post_tags',
  'pages',
  'page_blocks',
  
  // LMS
  'courses',
  'course_categories',
  'course_modules',
  'lessons',
  'enrollments',
  'quizzes',
  'questions',
  'answers',
  
  // Project Management
  'projects',
  'project_members',
  'tasks',
  
  // Files
  'file_folders',
  'files',
  
  // Call Center (important for rausach)
  'call_center_config',
  'call_center_records',
  
  // Invoice (important for business)
  'Hoadon',
  'HoadonChitiet',
];

// Tables that can be SKIPPED during quick backup (regeneratable/cache data)
export const SKIP_TABLES = [
  // System/Migrations
  '_prisma_migrations',
  
  // Logs & Audit (can be regenerated)
  'audit_logs',
  'call_center_sync_logs',
  'security_events',
  'task_activity_logs',
  
  // Session/Cache data
  'user_sessions',
  'verification_tokens',
  'user_devices',
  
  // Analytics (can be regenerated)
  'support_analytics',
  'aff_clicks',
  
  // Temporary data
  'notifications',
  'chat_messages',
  'chat_conversations',
];

// =====================================================
// ENVIRONMENT DETECTION
// =====================================================

export function getEnvironmentName(): string {
  const databaseUrl = process.env.DATABASE_URL || '';
  if (databaseUrl.includes('rausachcore')) {
    return 'rausach';
  } else if (databaseUrl.includes('tazagroupcore')) {
    return 'tazagroup';
  } else if (databaseUrl.includes('timonacore')) {
    return 'timona';
  }
  return 'default';
}

export function getBackupRootDir(): string {
  return path.join(__dirname, '../../backups', getEnvironmentName());
}

export function getFormattedDate(): string {
  const now = new Date();
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
}

// =====================================================
// PROGRESS TRACKING
// =====================================================

export interface ProgressInfo {
  current: number;
  total: number;
  table: string;
  records: number;
  percentage: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export type ProgressCallback = (info: ProgressInfo) => void;

export function createProgressBar(width: number = 40): (percent: number) => string {
  return (percent: number): string => {
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `[${bar}] ${percent.toFixed(1)}%`;
  };
}

// =====================================================
// FILE OPERATIONS
// =====================================================

export async function compressData(data: string): Promise<Buffer> {
  return gzip(Buffer.from(data, 'utf8'));
}

export async function decompressData(data: Buffer): Promise<string> {
  const result = await gunzip(data);
  return result.toString('utf8');
}

export async function writeBackupFile(
  filePath: string, 
  data: any[], 
  compress: boolean = true
): Promise<{ size: number; compressed: boolean }> {
  const jsonStr = JSON.stringify(data, null, 2);
  
  if (compress) {
    const compressed = await compressData(jsonStr);
    fs.writeFileSync(filePath + '.gz', compressed);
    return { 
      size: compressed.length, 
      compressed: true 
    };
  } else {
    fs.writeFileSync(filePath, jsonStr);
    return { 
      size: Buffer.byteLength(jsonStr, 'utf8'), 
      compressed: false 
    };
  }
}

export async function readBackupFile(filePath: string): Promise<any[]> {
  // Check for compressed file first
  if (fs.existsSync(filePath + '.gz')) {
    const compressed = fs.readFileSync(filePath + '.gz');
    const data = await decompressData(compressed);
    return JSON.parse(data);
  }
  
  // Fall back to uncompressed
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  
  throw new Error(`Backup file not found: ${filePath}`);
}

// =====================================================
// BACKUP MANAGEMENT
// =====================================================

export function getBackupFolders(backupDir: string): string[] {
  if (!fs.existsSync(backupDir)) {
    return [];
  }
  
  return fs.readdirSync(backupDir)
    .filter(f => {
      const fullPath = path.join(backupDir, f);
      return fs.statSync(fullPath).isDirectory() && /^\d{8}_\d{6}$/.test(f);
    })
    .sort()
    .reverse(); // Most recent first
}

export function getLatestBackupFolder(backupDir: string): string | null {
  const folders = getBackupFolders(backupDir);
  return folders[0] || null;
}

export function cleanupOldBackups(backupDir: string, maxBackups: number = 5): number {
  const folders = getBackupFolders(backupDir);
  let deleted = 0;
  
  if (folders.length > maxBackups) {
    const toDelete = folders.slice(maxBackups);
    
    for (const folder of toDelete) {
      const fullPath = path.join(backupDir, folder);
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
        deleted++;
      } catch (error) {
        console.error(`Failed to delete backup: ${folder}`);
      }
    }
  }
  
  return deleted;
}

export function getBackupStats(backupDir: string): {
  totalBackups: number;
  totalSize: string;
  latestBackup: string | null;
  oldestBackup: string | null;
} {
  const folders = getBackupFolders(backupDir);
  
  let totalBytes = 0;
  for (const folder of folders) {
    const folderPath = path.join(backupDir, folder);
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      const stat = fs.statSync(path.join(folderPath, file));
      totalBytes += stat.size;
    }
  }
  
  return {
    totalBackups: folders.length,
    totalSize: formatBytes(totalBytes),
    latestBackup: folders[0] || null,
    oldestBackup: folders[folders.length - 1] || null,
  };
}

// =====================================================
// SCHEMA PARSING
// =====================================================

export interface TableInfo {
  modelName: string;
  tableName: string;
  hasDependencies: boolean;
}

export function parseSchemaModels(): TableInfo[] {
  try {
    const schemaPath = path.join(__dirname, 'schema.prisma');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    const models: TableInfo[] = [];
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
        const hasDependencies = modelBody.includes('@relation');
        
        models.push({ modelName, tableName, hasDependencies });
      } else {
        i++;
      }
    }
    
    return models;
  } catch (error) {
    console.error('Error parsing schema.prisma:', error);
    return [];
  }
}

export function camelToSnakeCase(str: string): string {
  if (str.includes('_')) {
    return str.toLowerCase();
  }
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

// =====================================================
// DATABASE OPERATIONS
// =====================================================

export async function getExistingTables(prisma: PrismaClient): Promise<string[]> {
  try {
    const result: any[] = await prisma.$queryRaw`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    return result.map(row => row.tablename);
  } catch (error) {
    console.error('Error getting existing tables:', error);
    return [];
  }
}

export async function getTableRecordCount(
  prisma: PrismaClient, 
  tableName: string
): Promise<number> {
  try {
    const result: any[] = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) as count FROM "${tableName}"`
    );
    return parseInt(result[0]?.count || '0');
  } catch {
    return 0;
  }
}

export async function tableExists(prisma: PrismaClient, tableName: string): Promise<boolean> {
  try {
    await prisma.$queryRawUnsafe(`SELECT 1 FROM "${tableName}" LIMIT 1`);
    return true;
  } catch (error: any) {
    if (error.code === '42P01' || error.message?.includes('does not exist')) {
      return false;
    }
    return true;
  }
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

export function printHeader(title: string): void {
  const width = 70;
  console.log('\n' + '═'.repeat(width));
  console.log(`║ ${title.padEnd(width - 4)} ║`);
  console.log('═'.repeat(width));
}

export function printStats(stats: Record<string, any>): void {
  console.log('\n┌─────────────────────────────────────────────────────────────┐');
  for (const [key, value] of Object.entries(stats)) {
    console.log(`│ ${key.padEnd(25)} : ${String(value).padEnd(32)} │`);
  }
  console.log('└─────────────────────────────────────────────────────────────┘');
}

// =====================================================
// VALIDATION
// =====================================================

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export async function validateBackup(backupDir: string): Promise<ValidationResult> {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };
  
  if (!fs.existsSync(backupDir)) {
    result.isValid = false;
    result.errors.push(`Backup directory does not exist: ${backupDir}`);
    return result;
  }
  
  const files = fs.readdirSync(backupDir).filter(f => 
    f.endsWith('.json') || f.endsWith('.json.gz')
  );
  
  if (files.length === 0) {
    result.isValid = false;
    result.errors.push('No backup files found');
    return result;
  }
  
  // Check for priority tables
  for (const table of PRIORITY_TABLES.slice(0, 5)) {
    const hasFile = files.some(f => 
      f === `${table}.json` || f === `${table}.json.gz`
    );
    if (!hasFile) {
      result.warnings.push(`Priority table missing: ${table}`);
    }
  }
  
  // Validate file integrity
  for (const file of files.slice(0, 5)) {
    try {
      const filePath = path.join(backupDir, file);
      
      if (file.endsWith('.gz')) {
        const compressed = fs.readFileSync(filePath);
        await decompressData(compressed);
      } else {
        const content = fs.readFileSync(filePath, 'utf8');
        JSON.parse(content);
      }
    } catch (error) {
      result.warnings.push(`Corrupted file: ${file}`);
    }
  }
  
  return result;
}

// =====================================================
// EXPORT MANIFEST
// =====================================================

export interface BackupManifest {
  domain: string;
  createdAt: string;
  version: string;
  tables: {
    name: string;
    records: number;
    size: number;
    compressed: boolean;
  }[];
  totalRecords: number;
  totalSize: string;
  duration: number;
}

export function createManifest(
  domain: string,
  tables: { name: string; records: number; size: number; compressed: boolean }[],
  duration: number
): BackupManifest {
  const totalRecords = tables.reduce((sum, t) => sum + t.records, 0);
  const totalBytes = tables.reduce((sum, t) => sum + t.size, 0);
  
  return {
    domain,
    createdAt: new Date().toISOString(),
    version: '2.0',
    tables,
    totalRecords,
    totalSize: formatBytes(totalBytes),
    duration,
  };
}

export function saveManifest(backupDir: string, manifest: BackupManifest): void {
  const filePath = path.join(backupDir, 'manifest.json');
  fs.writeFileSync(filePath, JSON.stringify(manifest, null, 2));
}

export function loadManifest(backupDir: string): BackupManifest | null {
  try {
    const filePath = path.join(backupDir, 'manifest.json');
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}
