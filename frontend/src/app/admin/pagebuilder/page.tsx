'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FullScreenPageBuilder } from '@/components/page-builder/FullScreenPageBuilder';
import { getPages, deletePage } from '@/actions/page.actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Plus, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { DataTable } from './data-table';
import { toast } from 'sonner';

function PageBuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageId = searchParams.get('pageId');
  
  const [renderError, setRenderError] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Fetch pages
  const fetchPages = async () => {
    try {
      setLoading(true);
      const result = await getPages({ page: 1, limit: 100 }) as any;
      setPages(result.pages || []);
      setTotal(result.total || 0);
    } catch (error: any) {
      console.error('Error fetching pages:', error);
      setRenderError(error?.message || 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPages();
  }, []);

  // Open editor dialog when pageId is present
  useEffect(() => {
    if (pageId) {
      setIsEditorOpen(true);
    }
  }, [pageId]);

  // Refetch when closing editor
  useEffect(() => {
    if (!isEditorOpen && pageId) {
      fetchPages();
    }
  }, [isEditorOpen, pageId]);

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

  const handleDeletePage = async (id: string) => {
    try {
      await deletePage(id);
      toast.success('Page deleted successfully!');
      fetchPages();
    } catch (error: any) {
      console.error('Error deleting page:', error);
      toast.error(error?.message || 'Failed to delete page');
      throw error;
    }
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    router.push('/admin/pagebuilder');
    fetchPages();
  };

  // Error display
  if (renderError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle size={24} />
            <h2 className="text-xl font-bold">Error Loading Pages</h2>
          </div>
          <p className="text-gray-600 mb-4">
            {renderError || 'An unexpected error occurred'}
          </p>
          <div className="flex gap-2">
            <Button onClick={() => fetchPages()} className="flex-1">
              Retry
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
                  <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
                  <p className="mt-2 text-sm text-gray-600">
                    Manage and edit your website pages
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

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DataTable
            data={pages || []}
            isLoading={loading}
            onEdit={handleEditPage}
            onView={handleViewPage}
            onDelete={handleDeletePage}
            onRefresh={fetchPages}
          />
        </div>
      </div>

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
