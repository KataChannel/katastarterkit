import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import {
  CREATE_BLOG_CATEGORY,
  UPDATE_BLOG_CATEGORY,
  CreateBlogCategoryInput,
} from '@/graphql/blog.queries';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: any | null;
  onSuccess: () => void;
}

export function CategoryDialog({ open, onOpenChange, category, onSuccess }: CategoryDialogProps) {
  const [formData, setFormData] = useState<CreateBlogCategoryInput>({
    name: '',
    slug: '',
    description: '',
    thumbnail: '',
    order: 0,
    isActive: true,
  });

  const [createCategory, { loading: creating }] = useMutation(CREATE_BLOG_CATEGORY);
  const [updateCategory, { loading: updating }] = useMutation(UPDATE_BLOG_CATEGORY);

  const loading = creating || updating;
  const isEdit = !!category;

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (open) {
      if (category) {
        setFormData({
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          thumbnail: category.thumbnail || '',
          order: category.order || 0,
          isActive: category.isActive,
        });
      } else {
        setFormData({
          name: '',
          slug: '',
          description: '',
          thumbnail: '',
          order: 0,
          isActive: true,
        });
      }
    }
  }, [open, category]);

  // Auto generate slug from name
  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim(),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Clean up empty optional fields
      const cleanInput: any = {
        name: formData.name,
        slug: formData.slug,
      };

      if (formData.description && formData.description.trim()) {
        cleanInput.description = formData.description;
      }
      if (formData.thumbnail && formData.thumbnail.trim()) {
        cleanInput.thumbnail = formData.thumbnail;
      }
      if (formData.order !== undefined && formData.order !== null) {
        cleanInput.order = formData.order;
      }
      if (formData.isActive !== undefined && formData.isActive !== null) {
        cleanInput.isActive = formData.isActive;
      }

      if (isEdit) {
        await updateCategory({
          variables: {
            id: category.id,
            input: cleanInput,
          },
        });
        toast.success('Cập nhật danh mục thành công');
      } else {
        await createCategory({
          variables: { input: cleanInput },
        });
        toast.success('Tạo danh mục thành công');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Cập nhật thông tin danh mục' : 'Nhập thông tin danh mục blog mới'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
          <div className="space-y-4 py-4 px-1 flex-1">
            <div className="space-y-2">
              <Label htmlFor="name">
                Tên danh mục <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="VD: Công nghệ, Kinh doanh..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                Slug (Đường dẫn URL) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="VD: cong-nghe, kinh-doanh..."
                required
              />
              <p className="text-xs text-muted-foreground">
                URL sẽ là: /bai-viet/danh-muc/{formData.slug || 'slug'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả ngắn gọn về danh mục..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">URL hình ảnh</Label>
              <Input
                id="thumbnail"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="order">Thứ tự hiển thị</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Danh mục có thứ tự nhỏ hơn sẽ hiển thị trước
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Kích hoạt danh mục</Label>
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading || !formData.name || !formData.slug}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEdit ? 'Cập nhật' : 'Tạo danh mục'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
