'use client';

import React, { useState, useCallback } from 'react';
import { useFiles, useFileUpload, useDeleteFile, useBulkDeleteFiles } from '@/hooks/useFiles';
import type { File } from '@/types/file';
import { FileType, GetFilesInput } from '@/types/file';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UploadDialog } from '@/components/file-manager/UploadDialog';
import {
  Upload,
  Grid3x3,
  List,
  Search,
  Folder,
  File as FileIcon,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Archive,
  Trash2,
  Download,
  Eye,
  MoreVertical,
  FolderPlus,
  RefreshCw,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

type ViewMode = 'grid' | 'list';

interface SortOption {
  field: 'name' | 'date' | 'size' | 'type';
  order: 'asc' | 'desc';
}

interface FilterOption {
  type?: FileType;
}

interface FileManagerProps {
  onSelect?: (file: File) => void;
  allowMultiple?: boolean;
  folderId?: string;
  fileTypes?: FileType[];
  // New props for enhanced version
  viewMode?: ViewMode;
  sortBy?: SortOption;
  searchQuery?: string;
  filter?: FilterOption;
  limit?: number;
}

export function FileManager({
  onSelect,
  allowMultiple = false,
  folderId,
  fileTypes,
  viewMode: externalViewMode,
  sortBy: externalSortBy,
  searchQuery: externalSearchQuery,
  filter,
  limit = 20,
}: FileManagerProps) {
  const [internalViewMode, setInternalViewMode] = useState<ViewMode>('grid');
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  // Use external props if provided, otherwise use internal state
  const viewMode = externalViewMode || internalViewMode;
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const sortBy = externalSortBy || { field: 'date' as const, order: 'desc' as const };

  // Build query input
  const queryInput: GetFilesInput = {
    page,
    limit,
    filters: {
      ...(folderId && { folderId }),
      ...(searchQuery && { search: searchQuery }),
      ...(filter?.type && { fileType: filter.type }),
      ...(fileTypes && fileTypes.length > 0 && !filter?.type && { fileType: fileTypes[0] }),
    },
    sortBy: sortBy.field === 'name' ? 'filename' : sortBy.field === 'date' ? 'createdAt' : 'size',
    sortOrder: sortBy.order,
  };

  const { files, loading, refetch } = useFiles(queryInput);
  const { uploadFile, uploadFiles, uploading } = useFileUpload();
  const { deleteFile } = useDeleteFile();
  const { bulkDeleteFiles } = useBulkDeleteFiles();

  // File upload handler
  const handleFileUpload = useCallback(
    async (uploadedFiles: FileList | globalThis.File[]) => {
      try {
        const fileArray = Array.from(uploadedFiles);
        
        if (fileArray.length === 1) {
          await uploadFile(fileArray[0] as any, folderId);
        } else {
          await uploadFiles(fileArray as any, folderId);
        }

        toast({
          type: 'success',
          title: 'Success',
          description: `${fileArray.length} file(s) uploaded successfully`,
        });
        
        refetch();
        setUploadDialogOpen(false);
      } catch (error: any) {
        toast({
          type: 'error',
          title: 'Error',
          description: error.message || 'Failed to upload files',
          variant: 'destructive',
        });
      }
    },
    [uploadFile, uploadFiles, folderId, refetch, toast],
  );

  // Drag and drop handler
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFileUpload(droppedFiles);
      }
    },
    [handleFileUpload],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // File selection
  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      if (!allowMultiple) {
        newSelection.clear();
      }
      newSelection.add(fileId);
    }
    setSelectedFiles(newSelection);
  };

  // Delete file
  const handleDeleteFile = async (fileId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        await deleteFile(fileId);
        toast({
          type: 'success',
          title: 'Success',
          description: 'File deleted successfully',
        });
        refetch();
      } catch (error: any) {
        toast({
          type: 'error',
          title: 'Error',
          description: error.message || 'Failed to delete file',
          variant: 'destructive',
        });
      }
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) return;
    
    if (confirm(`Delete ${selectedFiles.size} selected file(s)?`)) {
      try {
        await bulkDeleteFiles({ fileIds: Array.from(selectedFiles) });
        toast({
          type: 'success',
          title: 'Success',
          description: `${selectedFiles.size} file(s) deleted successfully`,
        });
        setSelectedFiles(new Set());
        refetch();
      } catch (error: any) {
        toast({
          type: 'error',
          title: 'Error',
          description: error.message || 'Failed to delete files',
          variant: 'destructive',
        });
      }
    }
  };

  // Get file icon
  const getFileIcon = (fileType: FileType) => {
    switch (fileType) {
      case FileType.IMAGE:
        return <ImageIcon className="w-5 h-5" />;
      case FileType.VIDEO:
        return <Video className="w-5 h-5" />;
      case FileType.AUDIO:
        return <Music className="w-5 h-5" />;
      case FileType.DOCUMENT:
        return <FileText className="w-5 h-5" />;
      case FileType.ARCHIVE:
        return <Archive className="w-5 h-5" />;
      default:
        return <FileIcon className="w-5 h-5" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Toolbar - only show if not controlled externally */}
      {externalViewMode === undefined && externalSearchQuery === undefined && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search files..."
                    value={internalSearchQuery}
                    onChange={(e) => setInternalSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Upload */}
                <Button variant="default" size="sm" disabled={uploading} onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
                {/* Bulk Delete */}
                {selectedFiles.size > 0 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete ({selectedFiles.size})
                  </Button>
                )}
                {/* Refresh */}
                <Button variant="outline" size="sm" onClick={() => refetch()}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
                {/* View Mode */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setInternalViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setInternalViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUpload={handleFileUpload}
        onUploadSuccess={() => { refetch(); setUploadDialogOpen(false); }}
        folderId={folderId}
      />
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : files && files.items.length > 0 ? (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {files.items.map((file) => (
                  <Card
                    key={file.id}
                    className={`cursor-pointer hover:shadow-lg transition-shadow ${
                      selectedFiles.has(file.id) ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => toggleFileSelection(file.id)}
                  >
                    <CardContent className="p-4">
                      {/* Thumbnail */}
                      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                        {file.fileType === FileType.IMAGE ? (
                          <img
                            src={file.url}
                            alt={file.originalName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-gray-400">
                            {getFileIcon(file.fileType)}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <p className="text-sm font-medium truncate" title={file.originalName}>
                          {file.originalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="secondary" className="text-xs">
                          {file.fileType}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              window.open(file.url, '_blank');
                            }}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              window.open(file.url, '_blank');
                            }}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFile(file.id);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-2">
                {files.items.map((file) => (
                  <Card
                    key={file.id}
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedFiles.has(file.id) ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => toggleFileSelection(file.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          {/* Icon */}
                          <div className="text-gray-400">
                            {getFileIcon(file.fileType)}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{file.originalName}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{formatFileSize(file.size)}</span>
                              <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                              <Badge variant="secondary">{file.fileType}</Badge>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              window.open(file.url, '_blank');
                            }}>
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              window.open(file.url, '_blank');
                            }}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteFile(file.id);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {files.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!files.hasPreviousPage}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {files.page} of {files.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!files.hasNextPage}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Upload className="w-16 h-16 mb-4" />
            <p className="text-lg font-medium mb-2">No files yet</p>
            <p className="text-sm mb-4">Drop files here or click upload button</p>
          </div>
        )}
      </div>
    </div>
  );
}
