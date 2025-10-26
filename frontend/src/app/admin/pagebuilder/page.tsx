'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FullScreenPageBuilder } from '@/components/page-builder/FullScreenPageBuilder';
import { usePages, usePageOperations } from '@/hooks/usePageBuilder';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Trash2, 
  ExternalLink,
  Calendar,
  Globe,
  AlertCircle,
  MoreVertical,
  Loader2,
  Check,
  X,
  Grid3x3,
  LayoutList
} from 'lucide-react';
import { PageStatus, UpdatePageInput } from '@/types/page-builder';

function PageBuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageId = searchParams.get('pageId');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState<{ [key: string]: boolean }>({});
  
  const { pages, loading, refetch, error: queryError } = usePages(
    { page: 1, limit: 100 },
    searchTerm ? { search: searchTerm } : undefined,
    { skip: pageId ? true : false }
  );

  const { deletePage, updatePage } = usePageOperations();

  // Open editor dialog when pageId is present
  useEffect(() => {
    if (pageId) {
      setIsEditorOpen(true);
    }
  }, [pageId]);

  // Handle closing editor
  useEffect(() => {
    if (!isEditorOpen && pageId) {
      refetch();
    }
  }, [isEditorOpen, pageId, refetch]);

  // Filter pages based on status
  const filteredPages = useMemo(() => {
    if (!pages?.items) return [];
    
    // Create a copy to avoid mutating read-only arrays
    let filtered = [...pages.items];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    return filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return dateB - dateA;
    });
  }, [pages, statusFilter]);

  // Helper function to safely get blocks count
  const getBlocksCount = (blocks: any): number => {
    try {
      if (!blocks) return 0;
      if (Array.isArray(blocks)) return blocks.length;
      if (typeof blocks === 'object' && 'blocks' in blocks && Array.isArray(blocks.blocks)) {
        return blocks.blocks.length;
      }
      return 0;
    } catch (error) {
      console.error('Error getting blocks count:', error);
      return 0;
    }
  };

  // Helper function to safely render content
  const renderContent = (content: any): string => {
    try {
      if (!content) return '';
      if (typeof content === 'string') return content;
      if (typeof content === 'object') {
        return ''; // Don't render objects as text
      }
      return String(content);
    } catch (error) {
      console.error('Error rendering content:', error);
      return '';
    }
  };

  const handleCreateNewPage = () => {
    try {
      router.push('/admin/pagebuilder');
      setIsEditorOpen(true);
    } catch (error) {
      console.error('Error creating page:', error);
      setRenderError('Failed to create new page');
    }
  };

  const handleEditPage = (id: string) => {
    try {
      router.push(`/admin/pagebuilder?pageId=${id}`);
      setIsEditorOpen(true);
    } catch (error) {
      console.error('Error editing page:', error);
      setRenderError('Failed to edit page');
    }
  };

  const handleViewPage = (slug: string) => {
    try {
      window.open(`/${slug}`, '_blank');
    } catch (error) {
      console.error('Error viewing page:', error);
    }
  };

  const handleDeletePage = async (id: string, title: string) => {
    setDeleteConfirm({ id, title });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    setIsDeleting(true);
    try {
      await deletePage(deleteConfirm.id);
      setDeleteConfirm(null);
      refetch();
    } catch (error) {
      console.error('Error deleting page:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const page = pages?.items?.find(p => p.id === id);
    if (!page) return;
    
    setStatusUpdating(prev => ({ ...prev, [id]: true }));
    try {
      // Construct proper UpdatePageInput to avoid GraphQL validation errors
      const input: UpdatePageInput = {
        title: page.title,
        slug: page.slug,
        content: page.content || {},
        status: newStatus as PageStatus,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        seoKeywords: page.seoKeywords || [],
      };
      await updatePage(id, input);
      refetch();
    } catch (error) {
      console.error('Error updating page status:', error);
    } finally {
      setStatusUpdating(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleBackToList = () => {
    try {
      router.push('/admin/pagebuilder');
      setIsEditorOpen(false);
    } catch (error) {
      console.error('Error going back:', error);
      setRenderError('Failed to go back to list');
    }
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    router.push('/admin/pagebuilder');
    refetch(); // Refresh the page list
  };

  const getStatusColor = (status: PageStatus) => {
    try {
      switch (status) {
        case PageStatus.PUBLISHED:
          return 'bg-green-100 text-green-800 border-green-200';
        case PageStatus.DRAFT:
          return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case PageStatus.ARCHIVED:
          return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
          return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    } catch (error) {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Error display
  if (renderError || queryError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle size={24} />
            <h2 className="text-xl font-bold">Error Loading Page</h2>
          </div>
          <p className="text-gray-600 mb-4">
            {renderError || queryError?.message || 'An unexpected error occurred'}
          </p>
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()} className="flex-1">
              Reload Page
            </Button>
            <Button onClick={() => setRenderError(null)} variant="outline">
              Dismiss
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Page Builder</h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Create and manage your website pages with drag-and-drop builder
                  </p>
                </div>
                <Button 
                  onClick={handleCreateNewPage}
                  className="flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>New Page</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-xs">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search pages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  title="Grid view"
                >
                  <Grid3x3 size={20} />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('table')}
                  title="Table view"
                >
                  <LayoutList size={20} />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Loading pages...</p>
              </div>
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Globe size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pages found</h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Get started by creating your first page with our drag-and-drop builder.
              </p>
              <Button onClick={handleCreateNewPage} className="flex items-center space-x-2">
                <Plus size={20} />
                <span>Create Your First Page</span>
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            // Grid View
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPages.map((page) => {
                try {
                  if (!page || !page.id) return null;

                  return (
                    <Card key={page.id} className="p-6 hover:shadow-lg transition-all duration-200 flex flex-col">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                            {page.title || 'Untitled Page'}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            /{page.slug || 'untitled'}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditPage(page.id)}>
                              <Edit size={16} className="mr-2" /> Edit
                            </DropdownMenuItem>
                            {page.status === PageStatus.PUBLISHED && page.slug && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleViewPage(page.slug)}>
                                  <Eye size={16} className="mr-2" /> View Page
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(page.id, PageStatus.PUBLISHED)}
                              disabled={statusUpdating[page.id]}
                            >
                              {statusUpdating[page.id] && <Loader2 size={16} className="mr-2 animate-spin" />}
                              {!statusUpdating[page.id] && <Check size={16} className="mr-2" />}
                              Publish
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(page.id, PageStatus.DRAFT)}
                              disabled={statusUpdating[page.id]}
                            >
                              {statusUpdating[page.id] ? (
                                <Loader2 size={16} className="mr-2 animate-spin" />
                              ) : (
                                <Edit size={16} className="mr-2" />
                              )}
                              Save as Draft
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(page.id, PageStatus.ARCHIVED)}
                              disabled={statusUpdating[page.id]}
                            >
                              {statusUpdating[page.id] ? (
                                <Loader2 size={16} className="mr-2 animate-spin" />
                              ) : (
                                <X size={16} className="mr-2" />
                              )}
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeletePage(page.id, page.title || 'Untitled')}
                              className="text-red-600"
                            >
                              <Trash2 size={16} className="mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <Badge className={`${getStatusColor(page.status)} w-fit mb-4 border`}>
                        {String(page.status).toLowerCase()}
                      </Badge>

                      <div className="flex items-center justify-between text-xs text-gray-500 mb-4 flex-1">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Globe size={14} />
                          <span>{getBlocksCount(page.blocks)} blocks</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPage(page.id)}
                          className="flex-1"
                        >
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Button>
                        {page.status === PageStatus.PUBLISHED && page.slug && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPage(page.slug)}
                          >
                            <ExternalLink size={16} />
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                } catch (error) {
                  console.error('Error rendering page card:', page?.id, error);
                  return null;
                }
              })}
            </div>
          ) : (
            // Table View
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Blocks</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPages.map((page) => {
                    try {
                      if (!page || !page.id) return null;

                      return (
                        <TableRow key={page.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            <div className="max-w-xs">
                              <p className="truncate">{page.title || 'Untitled Page'}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">/{page.slug || 'untitled'}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(page.status)} border`}>
                              {String(page.status).toLowerCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center text-gray-600">
                            {getBlocksCount(page.blocks)}
                          </TableCell>
                          <TableCell className="text-gray-600 text-sm">
                            {page.updatedAt ? new Date(page.updatedAt).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditPage(page.id)}>
                                  <Edit size={16} className="mr-2" /> Edit
                                </DropdownMenuItem>
                                {page.status === PageStatus.PUBLISHED && page.slug && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleViewPage(page.slug)}>
                                      <Eye size={16} className="mr-2" /> View Page
                                    </DropdownMenuItem>
                                  </>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(page.id, PageStatus.PUBLISHED)}
                                  disabled={statusUpdating[page.id]}
                                >
                                  {statusUpdating[page.id] && <Loader2 size={16} className="mr-2 animate-spin" />}
                                  {!statusUpdating[page.id] && <Check size={16} className="mr-2" />}
                                  Publish
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(page.id, PageStatus.DRAFT)}
                                  disabled={statusUpdating[page.id]}
                                >
                                  {statusUpdating[page.id] ? (
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                  ) : (
                                    <Edit size={16} className="mr-2" />
                                  )}
                                  Save as Draft
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleStatusChange(page.id, PageStatus.ARCHIVED)}
                                  disabled={statusUpdating[page.id]}
                                >
                                  {statusUpdating[page.id] ? (
                                    <Loader2 size={16} className="mr-2 animate-spin" />
                                  ) : (
                                    <X size={16} className="mr-2" />
                                  )}
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeletePage(page.id, page.title || 'Untitled')}
                                  className="text-red-600"
                                >
                                  <Trash2 size={16} className="mr-2" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    } catch (error) {
                      console.error('Error rendering page row:', page?.id, error);
                      return null;
                    }
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle size={24} />
              Delete Page
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="ml-2 text-red-800">
                This action cannot be undone. The page "{deleteConfirm?.title}" will be permanently deleted.
              </AlertDescription>
            </Alert>
            
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this page? All associated content and blocks will be removed.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteConfirm(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
              Delete Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fullscreen Editor Dialog */}
      <Dialog open={isEditorOpen} onOpenChange={(open) => {
        setIsEditorOpen(open);
        if (!open) {
          handleCloseEditor();
        }
      }}>
        <DialogContent 
          className="max-w-full w-screen h-screen p-0 m-0 bg-white border-0 rounded-none"
          style={{ 
            maxWidth: '100vw', 
            maxHeight: '100vh',
            width: '100vw',
            height: '100vh'
          }}
        >
          <VisuallyHidden>
            <DialogTitle>Page Builder Editor</DialogTitle>
            <DialogDescription>
              Edit your page content using the visual page builder interface
            </DialogDescription>
          </VisuallyHidden>
          <div className="h-full w-full">
            <FullScreenPageBuilder 
              pageId={pageId || undefined}
              onExit={handleCloseEditor}
              initialMode="visual"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function AdminPageBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PageBuilderContent />
    </Suspense>
  );
}
