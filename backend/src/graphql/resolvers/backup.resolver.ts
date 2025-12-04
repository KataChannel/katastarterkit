import { Resolver, Query, Mutation, Args, ObjectType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

// =====================================================
// ENUMS
// =====================================================

export enum BackupStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
}

registerEnumType(BackupStatus, {
  name: 'BackupStatus',
  description: 'Status of backup operation',
});

export enum BackupType {
  SMART = 'SMART',
  FULL = 'FULL',
}

registerEnumType(BackupType, {
  name: 'BackupType',
  description: 'Type of backup',
});

// =====================================================
// TYPES
// =====================================================

@ObjectType()
export class BackupTableInfo {
  @Field()
  name!: string;

  @Field(() => Int)
  records!: number;

  @Field()
  size!: string;

  @Field()
  compressed!: boolean;
}

@ObjectType()
export class BackupInfo {
  @Field()
  folder!: string;

  @Field()
  domain!: string;

  @Field()
  createdAt!: string;

  @Field()
  totalSize!: string;

  @Field(() => Int)
  totalRecords!: number;

  @Field(() => Int)
  tableCount!: number;

  @Field(() => [BackupTableInfo], { nullable: true })
  tables?: BackupTableInfo[];

  @Field()
  hasManifest!: boolean;
}

@ObjectType()
export class BackupStats {
  @Field()
  domain!: string;

  @Field(() => Int)
  totalBackups!: number;

  @Field()
  totalSize!: string;

  @Field({ nullable: true })
  latestBackup?: string;

  @Field({ nullable: true })
  oldestBackup?: string;

  @Field(() => [BackupInfo])
  backups!: BackupInfo[];
}

@ObjectType()
export class BackupOperation {
  @Field()
  id!: string;

  @Field(() => BackupStatus)
  status!: BackupStatus;

  @Field()
  message!: string;

  @Field({ nullable: true })
  folder?: string;

  @Field({ nullable: true })
  error?: string;

  @Field(() => Int, { nullable: true })
  progress?: number;
}

// =====================================================
// RESOLVER
// =====================================================

@Resolver()
export class BackupResolver {
  private readonly backupsDir: string;
  private readonly backendDir: string;
  private runningOperations: Map<string, BackupOperation> = new Map();

  constructor() {
    this.backendDir = path.join(__dirname, '../../../');
    this.backupsDir = path.join(this.backendDir, '../backups');
  }

  // Helper: Get domain from DATABASE_URL
  private getDomain(): string {
    const dbUrl = process.env.DATABASE_URL || '';
    if (dbUrl.includes('rausachcore')) return 'rausach';
    if (dbUrl.includes('tazagroupcore')) return 'tazagroup';
    if (dbUrl.includes('timonacore')) return 'timona';
    return 'default';
  }

  // Helper: Format bytes
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Helper: Get folder size
  private getFolderSize(folderPath: string): number {
    let totalSize = 0;
    
    try {
      const files = fs.readdirSync(folderPath);
      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          totalSize += stats.size;
        }
      }
    } catch {
      // Ignore errors
    }
    
    return totalSize;
  }

  // Helper: Load manifest from backup folder
  private loadManifest(folderPath: string): any {
    try {
      const manifestPath = path.join(folderPath, 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      }
    } catch {
      // Ignore
    }
    return null;
  }

  // Helper: Get backup info
  private getBackupInfo(domain: string, folder: string): BackupInfo {
    const folderPath = path.join(this.backupsDir, domain, folder);
    const manifest = this.loadManifest(folderPath);
    
    // Parse folder name for date (YYYYMMDD_HHMMSS)
    let createdAt = folder;
    try {
      const year = folder.substring(0, 4);
      const month = folder.substring(4, 6);
      const day = folder.substring(6, 8);
      const hour = folder.substring(9, 11);
      const min = folder.substring(11, 13);
      const sec = folder.substring(13, 15);
      createdAt = `${year}-${month}-${day} ${hour}:${min}:${sec}`;
    } catch {
      // Keep original
    }

    if (manifest) {
      return {
        folder,
        domain,
        createdAt: manifest.createdAt || createdAt,
        totalSize: manifest.totalSize,
        totalRecords: manifest.totalRecords,
        tableCount: manifest.tables?.length || 0,
        tables: manifest.tables?.map((t: any) => ({
          name: t.name,
          records: t.records,
          size: this.formatBytes(t.size),
          compressed: t.compressed,
        })),
        hasManifest: true,
      };
    }

    // No manifest - calculate from files
    const size = this.getFolderSize(folderPath);
    const files = fs.readdirSync(folderPath).filter(f => 
      f.endsWith('.json') || f.endsWith('.json.gz')
    );

    return {
      folder,
      domain,
      createdAt,
      totalSize: this.formatBytes(size),
      totalRecords: 0, // Unknown without manifest
      tableCount: files.length,
      hasManifest: false,
    };
  }

  // =====================================================
  // QUERIES
  // =====================================================

  @Query(() => BackupStats)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getBackupStats(
    @Args('domain', { nullable: true }) domain?: string,
  ): Promise<BackupStats> {
    const targetDomain = domain || this.getDomain();
    const domainDir = path.join(this.backupsDir, targetDomain);

    if (!fs.existsSync(domainDir)) {
      return {
        domain: targetDomain,
        totalBackups: 0,
        totalSize: '0 B',
        backups: [],
      };
    }

    // Get all backup folders
    const folders = fs.readdirSync(domainDir)
      .filter(f => {
        const fullPath = path.join(domainDir, f);
        return fs.statSync(fullPath).isDirectory() && /^\d{8}_\d{6}$/.test(f);
      })
      .sort()
      .reverse();

    // Calculate total size
    let totalBytes = 0;
    const backups: BackupInfo[] = [];

    for (const folder of folders) {
      const info = this.getBackupInfo(targetDomain, folder);
      backups.push(info);
      totalBytes += this.getFolderSize(path.join(domainDir, folder));
    }

    return {
      domain: targetDomain,
      totalBackups: folders.length,
      totalSize: this.formatBytes(totalBytes),
      latestBackup: folders[0],
      oldestBackup: folders[folders.length - 1],
      backups,
    };
  }

  @Query(() => BackupInfo, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getBackupDetails(
    @Args('folder') folder: string,
    @Args('domain', { nullable: true }) domain?: string,
  ): Promise<BackupInfo | null> {
    const targetDomain = domain || this.getDomain();
    const folderPath = path.join(this.backupsDir, targetDomain, folder);

    if (!fs.existsSync(folderPath)) {
      return null;
    }

    return this.getBackupInfo(targetDomain, folder);
  }

  @Query(() => BackupOperation, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getBackupOperationStatus(
    @Args('operationId') operationId: string,
  ): Promise<BackupOperation | null> {
    return this.runningOperations.get(operationId) || null;
  }

  // =====================================================
  // MUTATIONS
  // =====================================================

  @Mutation(() => BackupOperation)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async createBackup(
    @Args('type', { type: () => BackupType, defaultValue: BackupType.SMART }) type: BackupType,
    @Args('domain', { nullable: true }) domain?: string,
  ): Promise<BackupOperation> {
    const targetDomain = domain || this.getDomain();
    const operationId = `backup_${Date.now()}`;

    const operation: BackupOperation = {
      id: operationId,
      status: BackupStatus.IN_PROGRESS,
      message: `Starting ${type.toLowerCase()} backup for ${targetDomain}...`,
      progress: 0,
    };

    this.runningOperations.set(operationId, operation);

    // Run backup in background
    setImmediate(async () => {
      try {
        const scriptPath = path.join(this.backendDir, 'prisma/smart-backup.ts');
        const args = type === BackupType.FULL ? ['--full'] : [];

        const child = spawn('bun', ['run', scriptPath, ...args], {
          cwd: this.backendDir,
          env: process.env,
        });

        let output = '';

        child.stdout.on('data', (data) => {
          output += data.toString();
          // Update progress based on output
          const progressMatch = output.match(/\[(\d+)\/(\d+)\]/);
          if (progressMatch) {
            const current = parseInt(progressMatch[1]);
            const total = parseInt(progressMatch[2]);
            operation.progress = Math.round((current / total) * 100);
          }
        });

        child.stderr.on('data', (data) => {
          output += data.toString();
        });

        child.on('close', (code) => {
          if (code === 0) {
            // Extract folder name from output
            const folderMatch = output.match(/Backup saved to:.*?\/(\d{8}_\d{6})/);
            operation.status = BackupStatus.SUCCESS;
            operation.message = 'Backup completed successfully';
            operation.folder = folderMatch ? folderMatch[1] : undefined;
            operation.progress = 100;
          } else {
            operation.status = BackupStatus.FAILED;
            operation.message = 'Backup failed';
            operation.error = output.substring(0, 500);
          }
        });

      } catch (error: any) {
        operation.status = BackupStatus.FAILED;
        operation.message = 'Backup failed';
        operation.error = error.message;
      }
    });

    return operation;
  }

  @Mutation(() => BackupOperation)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async restoreBackup(
    @Args('folder') folder: string,
    @Args('domain', { nullable: true }) domain?: string,
  ): Promise<BackupOperation> {
    const targetDomain = domain || this.getDomain();
    const operationId = `restore_${Date.now()}`;

    // Validate backup exists
    const backupPath = path.join(this.backupsDir, targetDomain, folder);
    if (!fs.existsSync(backupPath)) {
      return {
        id: operationId,
        status: BackupStatus.FAILED,
        message: 'Backup not found',
        error: `Backup folder does not exist: ${folder}`,
      };
    }

    const operation: BackupOperation = {
      id: operationId,
      status: BackupStatus.IN_PROGRESS,
      message: `Starting restore from ${folder}...`,
      folder,
      progress: 0,
    };

    this.runningOperations.set(operationId, operation);

    // Run restore in background
    setImmediate(async () => {
      try {
        const scriptPath = path.join(this.backendDir, 'prisma/quick-restore.ts');

        const child = spawn('bun', ['run', scriptPath, `--from=${folder}`], {
          cwd: this.backendDir,
          env: process.env,
        });

        let output = '';

        child.stdout.on('data', (data) => {
          output += data.toString();
          // Update progress
          const progressMatch = output.match(/\[(\d+)\/(\d+)\]/);
          if (progressMatch) {
            const current = parseInt(progressMatch[1]);
            const total = parseInt(progressMatch[2]);
            operation.progress = Math.round((current / total) * 100);
          }
        });

        child.stderr.on('data', (data) => {
          output += data.toString();
        });

        child.on('close', (code) => {
          if (code === 0) {
            operation.status = BackupStatus.SUCCESS;
            operation.message = 'Restore completed successfully';
            operation.progress = 100;
          } else {
            operation.status = BackupStatus.FAILED;
            operation.message = 'Restore failed';
            operation.error = output.substring(0, 500);
          }
        });

      } catch (error: any) {
        operation.status = BackupStatus.FAILED;
        operation.message = 'Restore failed';
        operation.error = error.message;
      }
    });

    return operation;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async deleteBackup(
    @Args('folder') folder: string,
    @Args('domain', { nullable: true }) domain?: string,
  ): Promise<boolean> {
    const targetDomain = domain || this.getDomain();
    const backupPath = path.join(this.backupsDir, targetDomain, folder);

    if (!fs.existsSync(backupPath)) {
      return false;
    }

    try {
      fs.rmSync(backupPath, { recursive: true, force: true });
      return true;
    } catch {
      return false;
    }
  }

  @Mutation(() => Int)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async cleanupOldBackups(
    @Args('keepCount', { type: () => Int, defaultValue: 5 }) keepCount: number,
    @Args('domain', { nullable: true }) domain?: string,
  ): Promise<number> {
    const targetDomain = domain || this.getDomain();
    const domainDir = path.join(this.backupsDir, targetDomain);

    if (!fs.existsSync(domainDir)) {
      return 0;
    }

    const folders = fs.readdirSync(domainDir)
      .filter(f => {
        const fullPath = path.join(domainDir, f);
        return fs.statSync(fullPath).isDirectory() && /^\d{8}_\d{6}$/.test(f);
      })
      .sort()
      .reverse();

    if (folders.length <= keepCount) {
      return 0;
    }

    const toDelete = folders.slice(keepCount);
    let deleted = 0;

    for (const folder of toDelete) {
      try {
        fs.rmSync(path.join(domainDir, folder), { recursive: true, force: true });
        deleted++;
      } catch {
        // Skip failed deletions
      }
    }

    return deleted;
  }
}
