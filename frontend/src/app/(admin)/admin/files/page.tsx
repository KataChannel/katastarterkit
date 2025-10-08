'use client';

import React, { useState } from 'react';
import { FileManager } from '@/components/file-manager/FileManager';
import { useStorageStats } from '@/hooks/useFiles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HardDrive, Files, FolderOpen, Image, Video, FileText } from 'lucide-react';

export default function FilesPage() {
  const { stats, loading } = useStorageStats();

  // Format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const usagePercent = stats
    ? (stats.totalSize / (10 * 1024 * 1024 * 1024)) * 100 // 10GB limit
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">File Manager</h1>
        <p className="text-gray-500">Manage your files and media assets</p>
      </div>

      {/* Storage Stats */}
      {!loading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Storage */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBytes(stats.totalSize)}</div>
              <Progress value={usagePercent} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {usagePercent.toFixed(1)}% of 10 GB used
              </p>
            </CardContent>
          </Card>

          {/* Total Files */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <Files className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFiles}</div>
              <p className="text-xs text-muted-foreground mt-2">
                Across all folders
              </p>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Images</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.filesByType.find((s) => s.type === 'IMAGE')?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {formatBytes(
                  stats.filesByType.find((s) => s.type === 'IMAGE')?.totalSize || 0
                )}
              </p>
            </CardContent>
          </Card>

          {/* Videos */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.filesByType.find((s) => s.type === 'VIDEO')?.count || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {formatBytes(
                  stats.filesByType.find((s) => s.type === 'VIDEO')?.totalSize || 0
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* File Manager */}
      <Card>
        <CardContent className="p-6">
          <FileManager />
        </CardContent>
      </Card>
    </div>
  );
}
