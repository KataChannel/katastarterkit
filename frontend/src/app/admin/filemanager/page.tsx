'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FileManager } from '@/components/file-manager/FileManager';
import { StorageAnalytics } from '@/components/file-manager/StorageAnalytics';
import { RecentActivity } from '@/components/file-manager/RecentActivity';
import { QuickActions } from '@/components/file-manager/QuickActions';
import { UploadDialog } from '@/components/file-manager/UploadDialog';
import { useStorageStats } from '@/hooks/useFiles';
import { FileType } from '@/types/file';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  HardDrive, 
  Files, 
  FolderOpen, 
  Image, 
  Video, 
  FileText,
  Download,
  Upload,
  Trash2,
  Search,
  Filter,
  Grid3x3,
  List,
  SortAsc,
  MoreVertical,
  Settings,
  Folder,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ViewMode {
  type: 'grid' | 'list';
}

interface SortOption {
  field: 'name' | 'date' | 'size' | 'type';
  order: 'asc' | 'desc';
}

export default function FileManagerPage() {
  const { stats, loading, refetch } = useStorageStats();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode['type']>('grid');
  const [sortBy, setSortBy] = useState<SortOption>({ field: 'name', order: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleRefresh = () => {
    refetch?.();
  };

  const handleUpload = useCallback(() => {
    setUploadDialogOpen(true);
  }, []);

  const handleUploadSuccess = useCallback(() => {
    toast({
      title: 'Upload successful',
      description: 'Files have been uploaded successfully.',
      type: 'success',
    });
    refetch?.();
  }, [refetch, toast]);

  const handleUploadFiles = useCallback(async (files: FileList | File[]) => {
    const formData = new FormData();
    const fileList = files instanceof FileList ? Array.from(files) : files;
    
    fileList.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/files/upload/bulk', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      handleUploadSuccess();
      return result;
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An error occurred during upload',
        type: 'error',
      });
      throw error;
    }
  }, [handleUploadSuccess, toast]);

  const handleCreateFolder = useCallback(() => {
    toast({
      title: 'Folder created',
      description: 'New folder has been created successfully.',
      type: 'success',
    });
    refetch?.();
  }, [refetch, toast]);

  const handleBulkDownload = useCallback(() => {
    toast({
      title: 'Download started',
      description: 'Your files are being downloaded.',
      type: 'info',
    });
  }, [toast]);

  const handleShare = useCallback(() => {
    toast({
      title: 'Share link created',
      description: 'Share link has been copied to clipboard.',
      type: 'success',
    });
  }, [toast]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+U: Upload
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        setUploadDialogOpen(true);
      }
      // Ctrl+F: Focus search
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
        searchInput?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">File Manager</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Quản lý tệp tin và tài nguyên media của bạn
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleUpload}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>File Manager Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Folder className="h-4 w-4 mr-2" />
                  Default Folder
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Trash Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Storage Overview Dashboard */}
      {!loading && stats && (
        <div className="px-6 py-6 bg-muted/30">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Analytics - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              <StorageAnalytics
                totalSize={stats.totalSize}
                totalFiles={stats.totalFiles}
                storageLimit={10 * 1024 * 1024 * 1024} // 10GB
                filesByType={stats.filesByType}
              />
              
              {/* Quick Actions */}
              <QuickActions
                onUpload={handleUpload}
                onCreateFolder={handleCreateFolder}
                onBulkDownload={handleBulkDownload}
                onShare={handleShare}
              />
            </div>

            {/* Recent Activity - Takes 1 column */}
            <div className="lg:col-span-1">
              <RecentActivity limit={8} />
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="px-6 py-4 border-b bg-background">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files and folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Filter */}
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Files</SelectItem>
              <SelectItem value="images">Images</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
              <SelectItem value="documents">Documents</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select 
            value={`${sortBy.field}-${sortBy.order}`}
            onValueChange={(value) => {
              const [field, order] = value.split('-');
              setSortBy({ field: field as SortOption['field'], order: order as SortOption['order'] });
            }}
          >
            <SelectTrigger className="w-40">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="size-desc">Largest First</SelectItem>
              <SelectItem value="size-asc">Smallest First</SelectItem>
            </SelectContent>
          </Select>

          <Separator orientation="vertical" className="h-8" />

          {/* View Mode */}
          <div className="flex items-center gap-1 border rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* File Manager Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full flex flex-col">
          <div className="px-6 border-b">
            <TabsList className="h-12">
              <TabsTrigger value="all" className="gap-2">
                <Files className="h-4 w-4" />
                All Files
              </TabsTrigger>
              <TabsTrigger value="recent" className="gap-2">
                <FileText className="h-4 w-4" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="images" className="gap-2">
                <Image className="h-4 w-4" />
                Images
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <Video className="h-4 w-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="trash" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Trash
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="flex-1 mt-0 p-6 overflow-auto">
            <FileManager viewMode={viewMode} sortBy={sortBy} searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="recent" className="flex-1 mt-0 p-6 overflow-auto">
            <FileManager 
              viewMode={viewMode} 
              sortBy={{ field: 'date', order: 'desc' }} 
              searchQuery={searchQuery}
              limit={50}
            />
          </TabsContent>

          <TabsContent value="images" className="flex-1 mt-0 p-6 overflow-auto">
            <FileManager 
              viewMode={viewMode} 
              sortBy={sortBy} 
              searchQuery={searchQuery}
              filter={{ type: FileType.IMAGE }}
            />
          </TabsContent>

          <TabsContent value="videos" className="flex-1 mt-0 p-6 overflow-auto">
            <FileManager 
              viewMode={viewMode} 
              sortBy={sortBy} 
              searchQuery={searchQuery}
              filter={{ type: FileType.VIDEO }}
            />
          </TabsContent>

          <TabsContent value="trash" className="flex-1 mt-0 p-6 overflow-auto">
            <div className="text-center py-12">
              <Trash2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Trash is Empty</h3>
              <p className="text-sm text-muted-foreground">
                Deleted files will appear here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Dialog */}
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleUploadFiles}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
