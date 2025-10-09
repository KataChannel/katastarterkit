'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  useCategoryTree,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useCategories';
import { Category, CreateCategoryInput, UpdateCategoryInput } from '@/graphql/category.queries';
import { CategoryTree } from '@/components/category';
import { CategoryForm } from '@/components/category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Plus, Loader2, FolderTree } from 'lucide-react';
import toast from 'react-hot-toast';

type DialogMode = 'create' | 'edit' | 'create-child' | null;

export default function CategoriesPage() {
  const router = useRouter();
  const [dialogMode, setDialogMode] = React.useState<DialogMode>(null);
  const [selectedCategory, setSelectedCategory] = React.useState<Category | null>(null);
  const [parentCategory, setParentCategory] = React.useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState<Category | null>(null);

  const { categoryTree, loading, error, refetch } = useCategoryTree();
  const { createCategory, loading: creating } = useCreateCategory();
  const { updateCategory, loading: updating } = useUpdateCategory();
  const { deleteCategory, loading: deleting } = useDeleteCategory();

  const handleCreate = () => {
    setSelectedCategory(null);
    setParentCategory(null);
    setDialogMode('create');
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setDialogMode('edit');
  };

  const handleAddChild = (parent: Category) => {
    setParentCategory(parent);
    setSelectedCategory(null);
    setDialogMode('create-child');
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);
      toast.success(`Đã xóa danh mục "${categoryToDelete.name}"`);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi xóa danh mục');
      console.error(error);
    }
  };

  const handleSubmit = async (data: CreateCategoryInput | UpdateCategoryInput) => {
    try {
      if (dialogMode === 'create' || dialogMode === 'create-child') {
        const input: CreateCategoryInput = {
          ...(data as CreateCategoryInput),
          parentId: dialogMode === 'create-child' ? parentCategory?.id : data.parentId,
        };
        await createCategory(input);
        toast.success('Tạo danh mục thành công!');
      } else if (dialogMode === 'edit' && selectedCategory) {
        await updateCategory(selectedCategory.id, data as UpdateCategoryInput);
        toast.success('Cập nhật danh mục thành công!');
      }
      setDialogMode(null);
      setSelectedCategory(null);
      setParentCategory(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi lưu danh mục');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setDialogMode(null);
    setSelectedCategory(null);
    setParentCategory(null);
  };

  const totalCategories = React.useMemo(() => {
    const countCategories = (categories: Category[]): number => {
      return categories.reduce((count, cat) => {
        return count + 1 + (cat.children ? countCategories(cat.children) : 0);
      }, 0);
    };
    return countCategories(categoryTree);
  }, [categoryTree]);

  const activeCategories = React.useMemo(() => {
    const countActive = (categories: Category[]): number => {
      return categories.reduce((count, cat) => {
        return (
          count +
          (cat.isActive ? 1 : 0) +
          (cat.children ? countActive(cat.children) : 0)
        );
      }, 0);
    };
    return countActive(categoryTree);
  }, [categoryTree]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý cây danh mục sản phẩm
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo danh mục mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng danh mục
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Đang hoạt động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {activeCategories}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Không hoạt động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {totalCategories - activeCategories}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Tree */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Cây danh mục
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Lỗi: {error.message}
            </div>
          ) : categoryTree.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Chưa có danh mục nào
              </p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo danh mục đầu tiên
              </Button>
            </div>
          ) : (
            <CategoryTree
              categories={categoryTree}
              selectedId={selectedCategory?.id}
              onSelect={setSelectedCategory}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
              onAddChild={handleAddChild}
              showActions
              showProductCount
            />
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogMode !== null} onOpenChange={() => handleCancel()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' && 'Tạo danh mục mới'}
              {dialogMode === 'create-child' &&
                `Tạo danh mục con cho "${parentCategory?.name}"`}
              {dialogMode === 'edit' && `Chỉnh sửa "${selectedCategory?.name}"`}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={selectedCategory || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={creating || updating}
            excludeId={selectedCategory?.id}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục "{categoryToDelete?.name}"?
              {categoryToDelete?.productCount && categoryToDelete.productCount > 0 && (
                <span className="block mt-2 text-red-500 font-medium">
                  Cảnh báo: Danh mục này có {categoryToDelete.productCount} sản phẩm.
                </span>
              )}
              {categoryToDelete?.children && categoryToDelete.children.length > 0 && (
                <span className="block mt-2 text-red-500 font-medium">
                  Cảnh báo: Danh mục này có {categoryToDelete.children.length} danh mục
                  con.
                </span>
              )}
              <span className="block mt-2">Hành động này không thể hoàn tác.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteConfirm();
              }}
              disabled={deleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
