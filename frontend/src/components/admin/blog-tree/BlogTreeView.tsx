import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { DELETE_BLOG, DELETE_BLOG_CATEGORY } from '@/graphql/blog.queries';
import { normalizeImageUrl } from '@/utils/image-url';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  ImageIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import Image from 'next/image';

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

interface BlogTreeViewProps {
  treeData: TreeNode[];
  expandedCategories: Set<string>;
  onToggleCategory: (categoryId: string) => void;
  onEditCategory: (category: any) => void;
  onRefetch: () => void;
}

export function BlogTreeView({
  treeData,
  expandedCategories,
  onToggleCategory,
  onEditCategory,
  onRefetch,
}: BlogTreeViewProps) {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: 'category' | 'blog' | 'category-with-blogs';
    item: any;
    blogs?: any[];
  }>({ open: false, type: 'blog', item: null, blogs: [] });

  const [deleteBlog] = useMutation(DELETE_BLOG, {
    onCompleted: () => {
      toast.success('Đã xóa bài viết');
      onRefetch();
    },
    onError: (error) => toast.error('Xóa thất bại: ' + error.message),
  });

  const [deleteCategory] = useMutation(DELETE_BLOG_CATEGORY, {
    onCompleted: () => {
      toast.success('Đã xóa danh mục');
      onRefetch();
    },
    onError: (error) => toast.error('Xóa thất bại: ' + error.message),
  });

  const handleDelete = async () => {
    try {
      if (deleteDialog.type === 'category-with-blogs') {
        // Xóa tất cả bài viết trong danh mục trước
        if (deleteDialog.blogs && deleteDialog.blogs.length > 0) {
          toast.loading('Đang xóa bài viết...', { id: 'deleting-blogs' });
          for (const blog of deleteDialog.blogs) {
            await deleteBlog({ variables: { id: blog.id } });
          }
          toast.success(`Đã xóa ${deleteDialog.blogs.length} bài viết`, { id: 'deleting-blogs' });
        }
        // Sau đó xóa danh mục
        await deleteCategory({ variables: { id: deleteDialog.item.id } });
        setDeleteDialog({ open: false, type: 'blog', item: null, blogs: [] });
      } else if (deleteDialog.type === 'category') {
        await deleteCategory({ variables: { id: deleteDialog.item.id } });
        setDeleteDialog({ open: false, type: 'blog', item: null, blogs: [] });
      } else {
        await deleteBlog({ variables: { id: deleteDialog.item.id } });
        setDeleteDialog({ open: false, type: 'blog', item: null, blogs: [] });
      }
    } catch (error: any) {
      toast.error('Có lỗi xảy ra: ' + error.message);
    }
  };

  const handleDeleteCategory = (node: TreeNode) => {
    if (node.blogs.length > 0) {
      // Có bài viết - hiện dialog xác nhận xóa cả bài viết
      setDeleteDialog({
        open: true,
        type: 'category-with-blogs',
        item: node.data,
        blogs: node.blogs,
      });
    } else {
      // Không có bài viết - xóa danh mục bình thường
      setDeleteDialog({
        open: true,
        type: 'category',
        item: node.data,
        blogs: [],
      });
    }
  };

  const getImageUrl = (url?: string | null) => {
    if (!url) return null;
    // Use normalizeImageUrl to handle HTTP → HTTPS conversion
    if (url.startsWith('http')) return normalizeImageUrl(url);
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:12001';
    return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="divide-y">
      {treeData.map((node) => (
        <div key={node.id} className="group">
          {/* Category Row */}
          <div className="flex items-center gap-2 p-3 hover:bg-muted/50 transition-colors">
            {/* Expand/Collapse Button */}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onToggleCategory(node.id)}
              disabled={node.blogs.length === 0}
            >
              {node.blogs.length > 0 ? (
                expandedCategories.has(node.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )
              ) : (
                <div className="w-4" />
              )}
            </Button>

            {/* Folder Icon */}
            <div className="flex-shrink-0">
              {expandedCategories.has(node.id) ? (
                <FolderOpen className="h-5 w-5 text-yellow-500" />
              ) : (
                <Folder className="h-5 w-5 text-yellow-500" />
              )}
            </div>

            {/* Category Thumbnail */}
            {node.thumbnail && (
              <div className="relative h-10 w-10 rounded overflow-hidden flex-shrink-0 border">
                <Image
                  src={getImageUrl(node.thumbnail) || ''}
                  alt={node.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            )}

            {/* Category Name & Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-sm sm:text-base truncate">
                  {node.name}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {node.postCount} bài
                </Badge>
                {!node.isActive && (
                  <Badge variant="outline" className="text-xs">
                    Tắt
                  </Badge>
                )}
              </div>
              {node.description && (
                <p className="text-xs sm:text-sm text-muted-foreground truncate mt-0.5">
                  {node.description}
                </p>
              )}
            </div>

            {/* Category Actions */}
            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
              {node.id !== 'uncategorized' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditCategory(node.data)}
                    className="h-8 w-8 p-0"
                    title="Chỉnh sửa danh mục"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(node)}
                    className="h-8 w-8 p-0"
                    title={
                      node.blogs.length > 0
                        ? 'Xóa danh mục và tất cả bài viết'
                        : 'Xóa danh mục'
                    }
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Blog List (Children) */}
          {expandedCategories.has(node.id) && node.blogs.length > 0 && (
            <div className="bg-muted/30">
              {node.blogs.map((blog: any) => (
                <div
                  key={blog.id}
                  className="flex items-center gap-2 p-3 pl-16 hover:bg-muted/70 transition-colors border-l-2 border-primary/20 group/blog"
                >
                  {/* Blog Icon */}
                  <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                  {/* Blog Thumbnail */}
                  {(blog.featuredImage || blog.thumbnailUrl) && (
                    <div className="relative h-10 w-10 rounded overflow-hidden flex-shrink-0 border">
                      {(() => {
                        const imageUrl = getImageUrl(blog.featuredImage || blog.thumbnailUrl);
                        return imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={blog.title}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* Blog Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium truncate">{blog.title}</span>
                      {blog.isFeatured && (
                        <TrendingUp className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" />
                      )}
                      <Badge
                        variant={blog.status === 'PUBLISHED' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {blog.status === 'PUBLISHED' ? 'Xuất bản' : 'Nháp'}
                      </Badge>
                    </div>
                    {blog.excerpt && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {blog.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Blog Actions */}
                  <div className="flex-shrink-0 opacity-0 group-hover/blog:opacity-100 transition-opacity flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(`/bai-viet/${blog.slug}`, '_blank')}
                      className="h-8 w-8 p-0"
                      title="Xem bài viết"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/blog/${blog.id}/edit`)}
                      className="h-8 w-8 p-0"
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteDialog({ open: true, type: 'blog', item: blog })}
                      className="h-8 w-8 p-0"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open, type: 'blog', item: null, blogs: [] })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3 text-left">
                {deleteDialog.type === 'category-with-blogs' ? (
                  <>
                    <p>
                      Bạn có chắc chắn muốn xóa danh mục{' '}
                      <strong className="text-foreground">&quot;{deleteDialog.item?.name}&quot;</strong>?
                    </p>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                      <p className="text-sm font-semibold text-destructive mb-1">
                        ⚠️ Cảnh báo: Danh mục này chứa {deleteDialog.blogs?.length} bài viết
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tất cả bài viết bên trong sẽ bị xóa vĩnh viễn cùng với danh mục.
                      </p>
                    </div>
                    <p className="text-sm">
                      Hành động này <strong>không thể hoàn tác</strong>. Bạn có chắc chắn muốn tiếp tục?
                    </p>
                  </>
                ) : deleteDialog.type === 'category' ? (
                  <p>
                    Bạn có chắc chắn muốn xóa danh mục{' '}
                    <strong className="text-foreground">&quot;{deleteDialog.item?.name}&quot;</strong>?
                    <br />
                    <span className="text-sm text-muted-foreground">
                      Hành động này không thể hoàn tác.
                    </span>
                  </p>
                ) : (
                  <p>
                    Bạn có chắc chắn muốn xóa bài viết{' '}
                    <strong className="text-foreground">&quot;{deleteDialog.item?.title}&quot;</strong>?
                    <br />
                    <span className="text-sm text-muted-foreground">
                      Hành động này không thể hoàn tác.
                    </span>
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              className={
                deleteDialog.type === 'category-with-blogs'
                  ? 'bg-destructive hover:bg-destructive/90'
                  : 'bg-destructive hover:bg-destructive/90'
              }
            >
              {deleteDialog.type === 'category-with-blogs' 
                ? `Xóa danh mục và ${deleteDialog.blogs?.length} bài viết` 
                : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
