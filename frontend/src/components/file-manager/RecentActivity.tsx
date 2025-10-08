'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Clock,
  File,
  Image,
  Video,
  FileText,
  Music,
  Archive,
  Download,
  Eye,
  Trash2
} from 'lucide-react';

interface RecentFile {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  thumbnail?: string;
}

interface RecentActivityProps {
  limit?: number;
}

export function RecentActivity({ limit = 10 }: RecentActivityProps) {
  // Mock data - in production, fetch from API
  const recentFiles: RecentFile[] = [
    {
      id: '1',
      name: 'project-design.png',
      type: 'IMAGE',
      size: 2048576,
      uploadedAt: '2 minutes ago',
    },
    {
      id: '2',
      name: 'presentation.pdf',
      type: 'DOCUMENT',
      size: 5242880,
      uploadedAt: '15 minutes ago',
    },
    {
      id: '3',
      name: 'demo-video.mp4',
      type: 'VIDEO',
      size: 15728640,
      uploadedAt: '1 hour ago',
    },
    {
      id: '4',
      name: 'audio-track.mp3',
      type: 'AUDIO',
      size: 4194304,
      uploadedAt: '2 hours ago',
    },
    {
      id: '5',
      name: 'backup.zip',
      type: 'ARCHIVE',
      size: 10485760,
      uploadedAt: '1 day ago',
    },
  ];

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const getFileIcon = (type: string) => {
    const iconClass = 'h-8 w-8';
    switch (type) {
      case 'IMAGE':
        return <Image className={`${iconClass} text-blue-500`} />;
      case 'VIDEO':
        return <Video className={`${iconClass} text-purple-500`} />;
      case 'DOCUMENT':
        return <FileText className={`${iconClass} text-green-500`} />;
      case 'AUDIO':
        return <Music className={`${iconClass} text-yellow-500`} />;
      case 'ARCHIVE':
        return <Archive className={`${iconClass} text-orange-500`} />;
      default:
        return <File className={`${iconClass} text-gray-500`} />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'IMAGE':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'VIDEO':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'DOCUMENT':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'AUDIO':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'ARCHIVE':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold text-lg">Recent Activity</h3>
          <Badge variant="outline" className="ml-auto">{recentFiles.length} files</Badge>
        </div>

        <div className="space-y-3">
          {recentFiles.slice(0, limit).map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
            >
              {/* File Icon */}
              <div className="flex-shrink-0">
                {getFileIcon(file.type)}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm truncate">{file.name}</p>
                  <Badge className={`text-xs ${getTypeBadgeColor(file.type)}`}>
                    {file.type}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatBytes(file.size)}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {file.uploadedAt}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {recentFiles.length > limit && (
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm" className="text-xs">
              View all {recentFiles.length} files
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
