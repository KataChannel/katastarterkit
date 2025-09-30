'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PageBuilder from '@/components/page-builder/PageBuilder';
import { usePages } from '@/hooks/usePageBuilder';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Trash2, 
  ExternalLink,
  Calendar,
  Globe
} from 'lucide-react';
import { PageStatus } from '@/types/page-builder';

function PageBuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageId = searchParams.get('pageId');
  
  const [showPageList, setShowPageList] = useState(!pageId);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { pages, loading, refetch } = usePages(
    { page: 1, limit: 20 },
    searchTerm ? { search: searchTerm } : undefined
  );

  useEffect(() => {
    setShowPageList(!pageId);
  }, [pageId]);

  const handleCreateNewPage = () => {
    router.push('/admin/pagebuilder');
    setShowPageList(false);
  };

  const handleEditPage = (id: string) => {
    router.push(`/admin/pagebuilder?pageId=${id}`);
    setShowPageList(false);
  };

  const handleViewPage = (slug: string) => {
    window.open(`/${slug}`, '_blank');
  };

  const handleBackToList = () => {
    router.push('/admin/pagebuilder');
    setShowPageList(true);
  };

  const getStatusColor = (status: PageStatus) => {
    switch (status) {
      case PageStatus.PUBLISHED:
        return 'bg-green-100 text-green-800';
      case PageStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800';
      case PageStatus.ARCHIVED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showPageList) {
    return (
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

              {/* Search */}
              <div className="mt-6 max-w-md">
                <div className="relative">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search pages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {pages?.items?.map((page) => (
                <Card key={page.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {page.title || 'Untitled Page'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        /{page.slug || 'untitled'}
                      </p>
                    </div>
                    <Badge className={getStatusColor(page.status)}>
                      {page.status.toLowerCase()}
                    </Badge>
                  </div>

                  {page.content && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {page.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>
                        {new Date(page.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe size={14} />
                      <span>{page.blocks?.length || 0} blocks</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPage(page.id)}
                      className="flex-1"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                    
                    {page.status === PageStatus.PUBLISHED && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewPage(page.slug)}
                        className="flex items-center space-x-1"
                      >
                        <ExternalLink size={16} />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {pages?.items?.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Globe size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pages yet</h3>
              <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                Get started by creating your first page with our drag-and-drop builder.
              </p>
              <Button onClick={handleCreateNewPage} className="flex items-center space-x-2">
                <Plus size={20} />
                <span>Create Your First Page</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Back Button */}
      <div className="bg-white border-b px-4 py-2">
        <Button
          variant="ghost"
          onClick={handleBackToList}
          className="text-blue-600 hover:text-blue-700"
        >
          ← Back to Pages
        </Button>
      </div>

      {/* Page Builder */}
      <div className="flex-1">
        <PageBuilder pageId={pageId || undefined} />
      </div>
    </div>
  );
}

export default function AdminPageBuilderPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading page builder...</div>}>
      <PageBuilderContent />
    </Suspense>
  );
}