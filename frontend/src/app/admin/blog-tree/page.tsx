'use client';

import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { GET_BLOGS, GET_BLOG_CATEGORIES_WITH_COUNT } from '@/graphql/blog.queries';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Plus, FolderTree } from 'lucide-react';
import { BlogTreeView } from '@/components/admin/blog-tree/BlogTreeView';
import { BlogTreeHeader } from '@/components/admin/blog-tree/BlogTreeHeader';
import { BlogTreeStats } from '@/components/admin/blog-tree/BlogTreeStats';
import { CategoryDialog } from '@/components/admin/blog-tree/CategoryDialog';
import { useRouter } from 'next/navigation';

interface TreeNode {
  id: string;
  type: 'category';
  name: string;
  slug: string;
  description?: string | null;
  thumbnail?: string | null;
  isActive: boolean;
  order: number;
  postCount: number;
  blogs: any[];
  data: any;
}

export default function BlogTreePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Fetch categories with post count
  const { data: categoriesData, loading: categoriesLoading, refetch: refetchCategories } = useQuery(
    GET_BLOG_CATEGORIES_WITH_COUNT
  );

  // Fetch all blogs
  const { data: blogsData, loading: blogsLoading, refetch: refetchBlogs } = useQuery(GET_BLOGS, {
    variables: {
      page: 1,
      limit: 1000, // Fetch all blogs
      statusFilter: 'ALL',
    },
  });

  const categories = categoriesData?.blogCategories || [];
  const blogs = blogsData?.blogs?.items || [];
  const loading = categoriesLoading || blogsLoading;

  // Build tree structure
  const treeData = useMemo(() => {
    // Filter by search term
    const filteredBlogs = searchTerm
      ? blogs.filter((blog: any) =>
          blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          blog.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : blogs;

    // Group blogs by category
    const blogsByCategory: Record<string, any[]> = {};
    const uncategorizedBlogs: any[] = [];

    filteredBlogs.forEach((blog: any) => {
      if (blog.category?.id) {
        if (!blogsByCategory[blog.category.id]) {
          blogsByCategory[blog.category.id] = [];
        }
        blogsByCategory[blog.category.id].push(blog);
      } else {
        uncategorizedBlogs.push(blog);
      }
    });

    // Build tree with categories and their blogs
    const tree = categories.map((category: any) => ({
      id: category.id,
      type: 'category' as const,
      name: category.name,
      slug: category.slug,
      description: category.description,
      thumbnail: category.thumbnail,
      isActive: category.isActive,
      order: category.order,
      postCount: category.postCount || 0,
      blogs: blogsByCategory[category.id] || [],
      data: category,
    }));

    // Add uncategorized section if there are uncategorized blogs
    if (uncategorizedBlogs.length > 0) {
      tree.push({
        id: 'uncategorized',
        type: 'category' as const,
        name: 'Chưa phân loại',
        slug: 'uncategorized',
        description: 'Các bài viết chưa được phân loại',
        thumbnail: null,
        isActive: true,
        order: 999,
        postCount: uncategorizedBlogs.length,
        blogs: uncategorizedBlogs,
        data: null,
      });
    }

    // Sort by order
    return tree.sort((a: TreeNode, b: TreeNode) => a.order - b.order);
  }, [categories, blogs, searchTerm]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalBlogs = blogs.length;
    const totalCategories = categories.length;
    const publishedBlogs = blogs.filter((b: any) => b.status === 'PUBLISHED').length;
    const draftBlogs = blogs.filter((b: any) => b.status === 'DRAFT').length;
    const featuredBlogs = blogs.filter((b: any) => b.isFeatured).length;

    return {
      totalBlogs,
      totalCategories,
      publishedBlogs,
      draftBlogs,
      featuredBlogs,
    };
  }, [blogs, categories]);

  const handleRefetch = () => {
    refetchCategories();
    refetchBlogs();
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
      <BlogTreeHeader
        onCreateCategory={handleCreateCategory}
        onCreateBlog={() => router.push('/admin/blog/create')}
      />

      {/* Stats */}
      <BlogTreeStats stats={stats} />

      {/* Search & Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm danh mục hoặc bài viết..."
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
                  : 'Bắt đầu bằng cách tạo danh mục và bài viết mới'}
              </p>
              {!searchTerm && (
                <div className="flex gap-2">
                  <Button onClick={handleCreateCategory}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo danh mục
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/admin/blog/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo bài viết
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <BlogTreeView
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
      <CategoryDialog
        open={showCategoryDialog}
        onOpenChange={setShowCategoryDialog}
        category={editingCategory}
        onSuccess={handleRefetch}
      />
    </div>
  );
}
