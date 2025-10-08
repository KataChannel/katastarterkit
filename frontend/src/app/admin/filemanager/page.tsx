'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { FileManager } from '@/components/file-manager/FileManager';
import { useStorageStats } from '@/hooks/useFiles';
import { FileType } from '@/types/file';
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
  RefreshCw
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
  const [viewMode, setViewMode] = useState<ViewMode['type']>('grid');
  const [sortBy, setSortBy] = useState<SortOption>({ field: 'name', order: 'asc' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Format bytes to readable size
  const formatBytes = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }, []);

  // Calculate storage usage
  const storageLimit = 10 * 1024 * 1024 * 1024; // 10GB
  const usagePercent = stats ? (stats.totalSize / storageLimit) * 100 : 0;
  const remainingSpace = storageLimit - (stats?.totalSize || 0);

  // Get file type stats
  const getFileTypeStats = useCallback((type: string) => {
    if (!stats) return { count: 0, size: 0 };
    const typeData = stats.filesByType.find((s) => s.type === type);
    return {
      count: typeData?.count || 0,
      size: typeData?.totalSize || 0
    };
  }, [stats]);

  const imageStats = getFileTypeStats('IMAGE');
  const videoStats = getFileTypeStats('VIDEO');
  const documentStats = getFileTypeStats('DOCUMENT');

  // Calculate storage health
  const storageHealth = useMemo(() => {
    if (usagePercent < 50) return { status: 'good', color: 'text-green-600', bgColor: 'bg-green-500' };
    if (usagePercent < 80) return { status: 'warning', color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
    return { status: 'critical', color: 'text-red-600', bgColor: 'bg-red-500' };
  }, [usagePercent]);

  const handleRefresh = () => {
    refetch?.();
  };

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
            <Button variant="outline" size="sm">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Storage Card */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Storage Usage</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold">
                      {formatBytes(stats.totalSize)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      / {formatBytes(storageLimit)}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className={storageHealth.color}>
                        {usagePercent.toFixed(1)}% used
                      </span>
                      <span className="text-muted-foreground">
                        {formatBytes(remainingSpace)} free
                      </span>
                    </div>
                    <Progress 
                      value={usagePercent} 
                      className="h-2"
                      indicatorClassName={storageHealth.bgColor}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Badge variant={
                      storageHealth.status === 'good' ? 'default' : 
                      storageHealth.status === 'warning' ? 'warning' : 
                      'destructive'
                    } className="text-xs">
                      {storageHealth.status === 'good' ? 'Healthy' : 
                       storageHealth.status === 'warning' ? 'Warning' : 
                       'Critical'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Total Files */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                  <Files className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{stats.totalFiles}</div>
                  <p className="text-xs text-muted-foreground">
                    Files across all folders
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Images</CardTitle>
                  <Image className="h-4 w-4 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{imageStats.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(imageStats.size)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Videos */}
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Videos</CardTitle>
                  <Video className="h-4 w-4 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div className="text-2xl font-bold">{videoStats.count}</div>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(videoStats.size)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* File Type Distribution */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.filesByType.map((typeData) => (
              <Card key={typeData.type} className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        {typeData.type}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold">{typeData.count}</p>
                        <p className="text-xs text-muted-foreground">files</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatBytes(typeData.totalSize)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {((typeData.totalSize / stats.totalSize) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <Progress 
                    value={(typeData.totalSize / stats.totalSize) * 100} 
                    className="mt-3 h-1"
                  />
                </CardContent>
              </Card>
            ))}
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
    </div>
  );
}
