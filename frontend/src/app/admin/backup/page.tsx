'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { 
  ArrowPathIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  FolderIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  ServerIcon,
  DocumentTextIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';

// GraphQL Queries & Mutations
const GET_BACKUP_STATS = gql`
  query GetBackupStats($domain: String) {
    getBackupStats(domain: $domain) {
      domain
      totalBackups
      totalSize
      latestBackup
      oldestBackup
      backups {
        folder
        domain
        createdAt
        totalSize
        totalRecords
        tableCount
        hasManifest
        tables {
          name
          records
          size
          compressed
        }
      }
    }
  }
`;

const GET_BACKUP_OPERATION_STATUS = gql`
  query GetBackupOperationStatus($operationId: String!) {
    getBackupOperationStatus(operationId: $operationId) {
      id
      status
      message
      folder
      error
      progress
    }
  }
`;

const CREATE_BACKUP = gql`
  mutation CreateBackup($type: BackupType!, $domain: String) {
    createBackup(type: $type, domain: $domain) {
      id
      status
      message
      folder
      progress
    }
  }
`;

const RESTORE_BACKUP = gql`
  mutation RestoreBackup($folder: String!, $domain: String) {
    restoreBackup(folder: $folder, domain: $domain) {
      id
      status
      message
      folder
      progress
    }
  }
`;

const DELETE_BACKUP = gql`
  mutation DeleteBackup($folder: String!, $domain: String) {
    deleteBackup(folder: $folder, domain: $domain)
  }
`;

const CLEANUP_OLD_BACKUPS = gql`
  mutation CleanupOldBackups($keepCount: Int!, $domain: String) {
    cleanupOldBackups(keepCount: $keepCount, domain: $domain)
  }
`;

// Types
type BackupStatus = 'SUCCESS' | 'FAILED' | 'IN_PROGRESS' | 'PENDING';
type BackupType = 'SMART' | 'FULL';

interface BackupTableInfo {
  name: string;
  records: number;
  size: string;
  compressed: boolean;
}

interface BackupInfo {
  folder: string;
  domain: string;
  createdAt: string;
  totalSize: string;
  totalRecords: number;
  tableCount: number;
  hasManifest: boolean;
  tables?: BackupTableInfo[];
}

interface BackupStats {
  domain: string;
  totalBackups: number;
  totalSize: string;
  latestBackup: string | null;
  oldestBackup: string | null;
  backups: BackupInfo[];
}

interface BackupOperation {
  id: string;
  status: BackupStatus;
  message: string;
  folder?: string;
  error?: string;
  progress?: number;
}

// Components
const StatusBadge: React.FC<{ status: BackupStatus }> = ({ status }) => {
  const config = {
    SUCCESS: { 
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      icon: CheckCircleIcon,
      text: 'Thành công'
    },
    FAILED: { 
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      icon: XCircleIcon,
      text: 'Thất bại'
    },
    IN_PROGRESS: { 
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      icon: ArrowPathIcon,
      text: 'Đang xử lý'
    },
    PENDING: { 
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      icon: ClockIcon,
      text: 'Chờ xử lý'
    },
  }[status];

  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className={`w-3.5 h-3.5 ${status === 'IN_PROGRESS' ? 'animate-spin' : ''}`} />
      {config.text}
    </span>
  );
};

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
    <div 
      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${progress}%` }}
    />
  </div>
);

const BackupCard: React.FC<{
  backup: BackupInfo;
  onRestore: (folder: string) => void;
  onDelete: (folder: string) => void;
  isRestoring: boolean;
  isDeleting: boolean;
}> = ({ backup, onRestore, onDelete, isRestoring, isDeleting }) => {
  const [expanded, setExpanded] = useState(false);
  
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy HH:mm:ss', { locale: vi });
    } catch {
      // Parse from folder name format: YYYYMMDD_HHMMSS
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const hour = dateStr.substring(9, 11);
      const min = dateStr.substring(11, 13);
      const sec = dateStr.substring(13, 15);
      return `${day}/${month}/${year} ${hour}:${min}:${sec}`;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FolderIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {backup.folder}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(backup.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRestore(backup.folder)}
              disabled={isRestoring}
              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
              title="Khôi phục"
            >
              {isRestoring ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <ArrowUpTrayIcon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => onDelete(backup.folder)}
              disabled={isDeleting}
              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
              title="Xóa"
            >
              {isDeleting ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                <TrashIcon className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {expanded ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Kích thước:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{backup.totalSize}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Bản ghi:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {backup.totalRecords.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Bảng:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">{backup.tableCount}</span>
          </div>
        </div>
        
        {!backup.hasManifest && (
          <div className="mt-3 flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span>Không có manifest (backup cũ)</span>
          </div>
        )}
      </div>
      
      {expanded && backup.tables && backup.tables.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <TableCellsIcon className="w-4 h-4" />
            Chi tiết bảng ({backup.tables.length})
          </h4>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {backup.tables.slice(0, 20).map((table) => (
              <div 
                key={table.name}
                className="flex items-center justify-between py-2 px-3 bg-white dark:bg-gray-800 rounded border border-gray-100 dark:border-gray-700"
              >
                <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                  {table.name}
                </span>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>{table.records.toLocaleString()} bản ghi</span>
                  <span>{table.size}</span>
                  {table.compressed && (
                    <span className="text-green-600 dark:text-green-400 text-xs">Nén</span>
                  )}
                </div>
              </div>
            ))}
            {backup.tables.length > 20 && (
              <p className="text-center text-sm text-gray-500">
                ... và {backup.tables.length - 20} bảng khác
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Page Component
export default function BackupManagerPage() {
  const [domain, setDomain] = useState<string | undefined>(undefined);
  const [operationId, setOperationId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Queries
  const { data, loading, refetch } = useQuery(GET_BACKUP_STATS, {
    variables: { domain },
    pollInterval: 30000, // Refresh every 30s
  });

  const { data: operationData } = useQuery(GET_BACKUP_OPERATION_STATUS, {
    variables: { operationId: operationId || '' },
    skip: !operationId,
    pollInterval: 1000, // Poll every second while operation is running
  });

  // Mutations
  const [createBackup, { loading: creatingBackup }] = useMutation(CREATE_BACKUP, {
    onCompleted: (data) => {
      setOperationId(data.createBackup.id);
    },
  });

  const [restoreBackup, { loading: restoringBackup }] = useMutation(RESTORE_BACKUP, {
    onCompleted: (data) => {
      setOperationId(data.restoreBackup.id);
    },
  });

  const [deleteBackup, { loading: deletingBackup }] = useMutation(DELETE_BACKUP, {
    onCompleted: () => {
      setConfirmDelete(null);
      refetch();
    },
  });

  const [cleanupBackups, { loading: cleaningUp }] = useMutation(CLEANUP_OLD_BACKUPS, {
    onCompleted: (data) => {
      alert(`Đã xóa ${data.cleanupOldBackups} bản backup cũ`);
      refetch();
    },
  });

  // Effect to handle operation completion
  useEffect(() => {
    if (operationData?.getBackupOperationStatus) {
      const op = operationData.getBackupOperationStatus;
      if (op.status === 'SUCCESS' || op.status === 'FAILED') {
        setTimeout(() => {
          setOperationId(null);
          refetch();
        }, 2000);
      }
    }
  }, [operationData, refetch]);

  const stats: BackupStats | null = data?.getBackupStats;
  const currentOperation: BackupOperation | null = operationData?.getBackupOperationStatus;

  const handleCreateBackup = (type: BackupType) => {
    createBackup({ variables: { type, domain } });
  };

  const handleRestore = (folder: string) => {
    if (confirm(`Bạn có chắc muốn khôi phục từ backup "${folder}"? Dữ liệu hiện tại sẽ bị thay thế.`)) {
      restoreBackup({ variables: { folder, domain } });
    }
  };

  const handleDelete = (folder: string) => {
    if (confirmDelete === folder) {
      deleteBackup({ variables: { folder, domain } });
    } else {
      setConfirmDelete(folder);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const handleCleanup = () => {
    if (confirm('Xóa các bản backup cũ, chỉ giữ lại 5 bản mới nhất?')) {
      cleanupBackups({ variables: { keepCount: 5, domain } });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <ServerIcon className="w-8 h-8 text-blue-600" />
          Quản lý Backup
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Sao lưu và khôi phục dữ liệu cho domain {stats?.domain || 'hiện tại'}
        </p>
      </div>

      {/* Current Operation Progress */}
      {currentOperation && currentOperation.status === 'IN_PROGRESS' && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ArrowPathIcon className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                {currentOperation.message}
              </span>
            </div>
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {currentOperation.progress || 0}%
            </span>
          </div>
          <ProgressBar progress={currentOperation.progress || 0} />
        </div>
      )}

      {/* Operation Result */}
      {currentOperation && (currentOperation.status === 'SUCCESS' || currentOperation.status === 'FAILED') && (
        <div className={`mb-6 p-4 rounded-lg border ${
          currentOperation.status === 'SUCCESS'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center gap-2">
            {currentOperation.status === 'SUCCESS' ? (
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            ) : (
              <XCircleIcon className="w-5 h-5 text-red-600" />
            )}
            <span className={`font-medium ${
              currentOperation.status === 'SUCCESS'
                ? 'text-green-900 dark:text-green-100'
                : 'text-red-900 dark:text-red-100'
            }`}>
              {currentOperation.message}
            </span>
          </div>
          {currentOperation.error && (
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              {currentOperation.error}
            </p>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tổng backup</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalBackups || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <FolderIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tổng dung lượng</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalSize || '0 B'}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DocumentTextIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Backup mới nhất</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {stats?.latestBackup || 'N/A'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <ClockIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Domain</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white uppercase">
                {stats?.domain || '-'}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <ServerIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={() => handleCreateBackup('SMART')}
          disabled={creatingBackup || !!operationId}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creatingBackup ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : (
            <ArrowDownTrayIcon className="w-5 h-5" />
          )}
          Backup thông minh
        </button>
        
        <button
          onClick={() => handleCreateBackup('FULL')}
          disabled={creatingBackup || !!operationId}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {creatingBackup ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : (
            <ArrowDownTrayIcon className="w-5 h-5" />
          )}
          Backup đầy đủ
        </button>
        
        <button
          onClick={handleCleanup}
          disabled={cleaningUp || (stats?.totalBackups || 0) <= 5}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cleaningUp ? (
            <ArrowPathIcon className="w-5 h-5 animate-spin" />
          ) : (
            <TrashIcon className="w-5 h-5" />
          )}
          Dọn dẹp (giữ 5)
        </button>
        
        <button
          onClick={() => refetch()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Backup List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Danh sách Backup
        </h2>
        
        {loading && !stats ? (
          <div className="flex items-center justify-center py-12">
            <ArrowPathIcon className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        ) : stats?.backups.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
            <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Chưa có backup nào</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Nhấn "Backup thông minh" để tạo backup đầu tiên
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {stats?.backups.map((backup) => (
              <BackupCard
                key={backup.folder}
                backup={backup}
                onRestore={handleRestore}
                onDelete={handleDelete}
                isRestoring={restoringBackup}
                isDeleting={deletingBackup && confirmDelete === backup.folder}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
