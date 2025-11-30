import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@/graphql/category.queries';
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

interface FormData {
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  isActive: boolean;
}

export function ProductCategoryDialog({ open, onOpenChange, category, onSuccess }: CategoryDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    description: '',
    image: '',
    displayOrder: 0,
    isActive: true,
  });

  const [createCategory, { loading: creating }] = useMutation(CREATE_CATEGORY);
  const [updateCategory, { loading: updating }] = useMutation(UPDATE_CATEGORY);

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
          image: category.image || '',
          displayOrder: category.displayOrder || 0,
          isActive: category.isActive,
        });
      } else {
        setFormData({
          name: '',
          slug: '',
          description: '',
          image: '',
          displayOrder: 0,
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
      };

      // Only include slug for create
      if (!isEdit) {
        cleanInput.slug = formData.slug;
      }

      if (formData.description && formData.description.trim()) {
        cleanInput.description = formData.description;
      }
      if (formData.image && formData.image.trim()) {
        cleanInput.image = formData.image;
      }
      if (formData.displayOrder !== undefined && formData.displayOrder !== null) {
        cleanInput.displayOrder = formData.displayOrder;
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
            {isEdit ? 'Cập nhật thông tin danh mục sản phẩm' : 'Nhập thông tin danh mục sản phẩm mới'}
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
                placeholder="VD: Sách văn học, Sách giáo khoa..."
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
                placeholder="VD: sach-van-hoc, sach-giao-khoa..."
                required
                disabled={isEdit}
              />
              <p className="text-xs text-muted-foreground">
                URL sẽ là: /danh-muc/{formData.slug || 'slug'}
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
              <Label htmlFor="image">URL hình ảnh</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayOrder">Thứ tự hiển thị</Label>
              <Input
                id="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={(e) =>
                  setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })
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
