'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '@/graphql/product.queries';
import { GET_CATEGORIES } from '@/graphql/category.queries';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Plus, FolderTree } from 'lucide-react';
import { ProductTreeView } from '@/components/admin/product-tree/ProductTreeView';
import { ProductTreeHeader } from '@/components/admin/product-tree/ProductTreeHeader';
import { ProductTreeStats } from '@/components/admin/product-tree/ProductTreeStats';
import { ProductCategoryDialog } from '@/components/admin/product-tree/ProductCategoryDialog';
import { useRouter } from 'next/navigation';

interface TreeNode {
  id: string;
  type: 'category';
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  isActive: boolean;
  displayOrder: number;
  productCount: number;
  products: any[];
  data: any;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Fetch categories
  const { data: categoriesData, loading: categoriesLoading, refetch: refetchCategories } = useQuery(
    GET_CATEGORIES,
    {
      variables: {
        input: {
          limit: 100,
          sortBy: 'displayOrder',
          sortOrder: 'asc',
        },
      },
    }
  );

  // Fetch all products
  const { data: productsData, loading: productsLoading, refetch: refetchProducts } = useQuery(GET_PRODUCTS, {
    variables: {
      input: {
        page: 1,
        limit: 1000, // Fetch all products
      },
    },
  });

  const categories = categoriesData?.categories?.items || [];
  const products = productsData?.products?.items || [];
  const loading = categoriesLoading || productsLoading;

  // Build tree structure
  const treeData = useMemo(() => {
    // Filter by search term
    const filteredProducts = searchTerm
      ? products.filter((product: any) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : products;

    // Group products by category
    const productsByCategory: Record<string, any[]> = {};
    const uncategorizedProducts: any[] = [];

    filteredProducts.forEach((product: any) => {
      if (product.category?.id) {
        if (!productsByCategory[product.category.id]) {
          productsByCategory[product.category.id] = [];
        }
        productsByCategory[product.category.id].push(product);
      } else {
        uncategorizedProducts.push(product);
      }
    });

    // Build tree with categories and their products
    const tree = categories.map((category: any) => ({
      id: category.id,
      type: 'category' as const,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      isActive: category.isActive,
      displayOrder: category.displayOrder || 0,
      productCount: category.productCount || productsByCategory[category.id]?.length || 0,
      products: productsByCategory[category.id] || [],
      data: category,
    }));

    // Add uncategorized section if there are uncategorized products
    if (uncategorizedProducts.length > 0) {
      tree.push({
        id: 'uncategorized',
        type: 'category' as const,
        name: 'Chưa phân loại',
        slug: 'uncategorized',
        description: 'Các sản phẩm chưa được phân loại',
        image: null,
        isActive: true,
        displayOrder: 999,
        productCount: uncategorizedProducts.length,
        products: uncategorizedProducts,
        data: null,
      });
    }

    // Sort by displayOrder
    return tree.sort((a: TreeNode, b: TreeNode) => a.displayOrder - b.displayOrder);
  }, [categories, products, searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalCategories = categories.length;
    const activeProducts = products.filter((p: any) => p.status === 'ACTIVE').length;
    const draftProducts = products.filter((p: any) => p.status === 'DRAFT').length;
    const featuredProducts = products.filter((p: any) => p.isFeatured).length;
    const outOfStock = products.filter((p: any) => p.stock <= 0).length;

    return {
      totalProducts,
      totalCategories,
      activeProducts,
      draftProducts,
      featuredProducts,
      outOfStock,
    };
  }, [products, categories]);

  const handleRefetch = () => {
    refetchCategories();
    refetchProducts();
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleExpandAll = () => {
    setExpandedCategories(new Set(treeData.map((c: TreeNode) => c.id)));
  };

  const handleCollapseAll = () => {
    setExpandedCategories(new Set());
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
                placeholder="Tìm kiếm danh mục hoặc sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExpandAll}
                className="flex-1 sm:flex-none"
              >
                Mở tất cả
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCollapseAll}
                className="flex-1 sm:flex-none"
              >
                Thu gọn
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tree View */}
      <Card>
        <CardContent className="p-0">
          {treeData.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderTree className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có dữ liệu</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchTerm
                  ? 'Không tìm thấy kết quả phù hợp'
                  : 'Bắt đầu bằng cách tạo danh mục và sản phẩm mới'}
              </p>
              {!searchTerm && (
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
              )}
            </div>
          ) : (
            <ProductTreeView
              treeData={treeData}
              expandedCategories={expandedCategories}
              onToggleCategory={toggleCategory}
              onEditCategory={handleEditCategory}
              onRefetch={handleRefetch}
            />
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
