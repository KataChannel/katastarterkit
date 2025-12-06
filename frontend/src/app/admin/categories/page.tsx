'use client';

import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Plus, FolderTree, X } from 'lucide-react';
import { ProductTreeView } from '@/components/admin/product-tree/ProductTreeView';
import { ProductTreeHeader } from '@/components/admin/product-tree/ProductTreeHeader';
import { ProductTreeStats } from '@/components/admin/product-tree/ProductTreeStats';
import { ProductCategoryDialog } from '@/components/admin/product-tree/ProductCategoryDialog';
import { SearchResultsView } from '@/components/admin/product-tree/SearchResultsView';
import { useRouter } from 'next/navigation';
import { useOptimizedProductTree, TreeNode, TreeProduct } from '@/hooks/useOptimizedProductTree';
import { useState } from 'react';

export default function CategoriesPage() {
  const router = useRouter();
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Use optimized hook with server-side search and lazy loading
  const {
    treeData,
    searchResults,
    isSearchMode,
    loading,
    searchLoading,
    searchTerm,
    setSearchTerm,
    clearSearch,
    expandedCategories,
    toggleCategory,
    expandAll,
    collapseAll,
    stats,
    refetch,
  } = useOptimizedProductTree({
    searchDebounceMs: 300,
    productsPerCategory: 50,
  });

  const handleRefetch = () => {
    refetch();
  };

  const handleExpandAll = () => {
    expandAll();
  };

  const handleCollapseAll = () => {
    collapseAll();
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setShowCategoryDialog(true);
  };

  const handleCreateCategory = () => {
    setEditingCategory(null);
    setShowCategoryDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <ProductTreeHeader
        onCreateCategory={handleCreateCategory}
        onCreateProduct={() => router.push('/admin/products/create')}
      />

      {/* Stats */}
      <ProductTreeStats stats={stats} />

      {/* Search & Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm danh mục hoặc sản phẩm... (nhập từ 2 ký tự)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-20"
              />
              {searchTerm && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  {searchLoading && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExpandAll}
                className="flex-1 sm:flex-none"
                disabled={isSearchMode}
              >
                Mở tất cả
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCollapseAll}
                className="flex-1 sm:flex-none"
                disabled={isSearchMode}
              >
                Thu gọn
              </Button>
            </div>
          </div>
          
          {/* Search Mode Indicator */}
          {isSearchMode && (
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Search className="h-3 w-3 mr-1" />
                Tìm kiếm: &quot;{searchTerm}&quot;
              </Badge>
              {!searchLoading && (
                <span className="text-sm text-muted-foreground">
                  {searchResults.length} kết quả
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results or Tree View */}
      <Card>
        <CardContent className="p-0">
          {isSearchMode ? (
            // Search Results Mode
            searchLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Đang tìm kiếm...</span>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Search className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Không tìm thấy kết quả</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Không có sản phẩm nào phù hợp với &quot;{searchTerm}&quot;
                </p>
                <Button variant="outline" onClick={clearSearch}>
                  <X className="h-4 w-4 mr-2" />
                  Xóa tìm kiếm
                </Button>
              </div>
            ) : (
              <SearchResultsView 
                results={searchResults} 
                searchTerm={searchTerm}
                onRefetch={handleRefetch}
              />
            )
          ) : (
            // Tree View Mode
            treeData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FolderTree className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Chưa có dữ liệu</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Bắt đầu bằng cách tạo danh mục và sản phẩm mới
                </p>
                <div className="flex gap-2">
                  <Button onClick={handleCreateCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo danh mục
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/admin/products/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo sản phẩm
                  </Button>
                </div>
              </div>
            ) : (
              <ProductTreeView
                treeData={treeData}
                expandedCategories={expandedCategories}
                onToggleCategory={toggleCategory}
                onEditCategory={handleEditCategory}
                onRefetch={handleRefetch}
              />
            )
          )}
        </CardContent>
      </Card>

      {/* Category Dialog */}
      <ProductCategoryDialog
        open={showCategoryDialog}
        onOpenChange={setShowCategoryDialog}
        category={editingCategory}
        onSuccess={handleRefetch}
      />
    </div>
  );
}
