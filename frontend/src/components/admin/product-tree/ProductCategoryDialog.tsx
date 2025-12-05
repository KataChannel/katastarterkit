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
import { Loader2, Sparkles, ImageIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

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
  
  // AI loading states
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);

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

  // Generate description with AI
  const handleGenerateDescription = async () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục trước');
      return;
    }
    
    setGeneratingDescription(true);
    try {
      const response = await fetch('/api/ai/ecommerce/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: 'category',
          context: 'Danh mục sách cũ, sách đã qua sử dụng',
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo mô tả');
      }
      
      setFormData({ ...formData, description: data.description });
      toast.success('Đã tạo mô tả bằng AI');
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tạo mô tả');
    } finally {
      setGeneratingDescription(false);
    }
  };

  // Generate image with AI
  const handleGenerateImage = async () => {
    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên danh mục trước');
      return;
    }
    
    setGeneratingImage(true);
    try {
      const response = await fetch('/api/ai/ecommerce/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: 'category',
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo hình ảnh');
      }
      
      setFormData({ ...formData, image: data.imageUrl });
      toast.success('Đã tạo hình ảnh bằng AI');
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi tạo hình ảnh');
    } finally {
      setGeneratingImage(false);
    }
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
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Mô tả</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateDescription}
                  disabled={generatingDescription || !formData.name.trim()}
                  className="h-7 text-xs gap-1"
                >
                  {generatingDescription ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  Tạo bằng AI
                </Button>
              </div>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả ngắn gọn về danh mục..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="image">URL hình ảnh</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateImage}
                  disabled={generatingImage || !formData.name.trim()}
                  className="h-7 text-xs gap-1"
                >
                  {generatingImage ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <ImageIcon className="h-3 w-3" />
                  )}
                  Tạo hình AI
                </Button>
              </div>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="mt-2 relative w-full h-32 rounded-md overflow-hidden border">
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
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
