'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter, useParams } from 'next/navigation';
import {
  UPDATE_MENU_ADMIN,
  GET_MENU_BY_ID_ADMIN,
  GET_MENUS_TREE,
} from '@/graphql/menu.queries';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DynamicMenuLinkSelector } from '@/components/menu/DynamicMenuLinkSelector';
import { Loader2, ArrowLeft, Save } from 'lucide-react';

export default function MenuFormPage() {
  const router = useRouter();
  const params = useParams();
  const menuId = params?.id as string;
  const isEdit = !!menuId;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    type: 'HEADER',
    parentId: '',
    order: 0,
    url: '',
    route: '',
    externalUrl: '',
    target: 'SELF',
    linkType: 'URL',
    icon: '',
    badge: '',
    badgeColor: '',
    image: '',
    isActive: true,
    isVisible: true,
    cssClass: '',
    // Dynamic link fields
    productId: '',
    blogPostId: '',
    pageId: '',
    categoryId: '',
    blogCategoryId: '',
    queryConditions: null,
  });

  // Load menu data for editing
  const { loading: loadingMenu } = useQuery(GET_MENU_BY_ID_ADMIN, {
    variables: { id: menuId },
    skip: !isEdit,
    onCompleted: (data) => {
      if (data?.menu) {
        setFormData({
          title: data.menu.title || '',
          slug: data.menu.slug || '',
          description: data.menu.description || '',
          type: data.menu.type || 'HEADER',
          parentId: data.menu.parentId || '',
          order: data.menu.order || 0,
          url: data.menu.url || '',
          route: data.menu.route || '',
          externalUrl: data.menu.externalUrl || '',
          target: data.menu.target || 'SELF',
          linkType: data.menu.linkType || 'URL',
          icon: data.menu.icon || '',
          badge: data.menu.badge || '',
          badgeColor: data.menu.badgeColor || '',
          image: data.menu.image || '',
          isActive: data.menu.isActive !== false,
          isVisible: data.menu.isVisible !== false,
          cssClass: data.menu.cssClass || '',
          productId: data.menu.productId || '',
          blogPostId: data.menu.blogPostId || '',
          pageId: data.menu.pageId || '',
          categoryId: data.menu.categoryId || '',
          blogCategoryId: data.menu.blogCategoryId || '',
          queryConditions: data.menu.queryConditions || null,
        });
      }
    },
    onError: (error) => {
      toast.error('Lỗi: ' + error.message);
      router.push('/admin/menu');
    },
  });

  // Load menu tree for parent selection
  const { data: menusData } = useQuery(GET_MENUS_TREE);
  const menus = menusData?.menuTree || [];

  const [updateMenu, { loading: updating }] = useMutation(UPDATE_MENU_ADMIN, {
    onCompleted: () => {
      toast.success('Đã cập nhật menu thành công!');
      router.push('/admin/menu');
    },
    onError: (error) => toast.error('Lỗi: ' + error.message),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.slug) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    const input: any = {
      title: formData.title,
      slug: formData.slug,
      description: formData.description || undefined,
      type: formData.type,
      parentId: formData.parentId || undefined,
      order: parseInt(String(formData.order)) || 0,
      target: formData.target,
      linkType: formData.linkType,
      icon: formData.icon || undefined,
      badge: formData.badge || undefined,
      badgeColor: formData.badgeColor || undefined,
      image: formData.image || undefined,
      isActive: formData.isActive,
      isVisible: formData.isVisible,
      cssClass: formData.cssClass || undefined,
    };

    // Set URL based on linkType
    if (formData.linkType === 'URL') {
      if (formData.externalUrl) {
        input.externalUrl = formData.externalUrl;
      } else if (formData.route) {
        input.route = formData.route;
      } else {
        input.url = formData.url;
      }
    } else {
      // Dynamic link
      input.productId = formData.productId || undefined;
      input.blogPostId = formData.blogPostId || undefined;
      input.pageId = formData.pageId || undefined;
      input.categoryId = formData.categoryId || undefined;
      input.blogCategoryId = formData.blogCategoryId || undefined;
      input.queryConditions = formData.queryConditions || undefined;
    }

    await updateMenu({ variables: { input } });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleDynamicLinkChange = (values: any) => {
    setFormData({
      ...formData,
      ...values,
    });
  };

  if (loadingMenu) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {isEdit ? 'Chỉnh Sửa Menu' : 'Tạo Menu Mới'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Quản lý menu động với điều kiện tùy chỉnh
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Cơ Bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Tiêu Đề <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      title: e.target.value,
                      slug: generateSlug(e.target.value),
                    });
                  }}
                  placeholder="VD: Sản Phẩm Nổi Bật"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="VD: san-pham-noi-bat"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô Tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả ngắn gọn về menu..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Vị Trí Menu</Label>
                <Select value={formData.type} onValueChange={(type) => setFormData({ ...formData, type })}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HEADER">Header</SelectItem>
                    <SelectItem value="FOOTER">Footer</SelectItem>
                    <SelectItem value="SIDEBAR">Sidebar</SelectItem>
                    <SelectItem value="MOBILE">Mobile</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentId">Menu Cha</Label>
                <Select value={formData.parentId} onValueChange={(parentId) => setFormData({ ...formData, parentId })}>
                  <SelectTrigger id="parentId">
                    <SelectValue placeholder="-- Không có --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">-- Không có --</SelectItem>
                    {menus.map((menu: any) => (
                      <SelectItem key={menu.id} value={menu.id}>
                        {menu.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Thứ Tự</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  min={0}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Link Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Cấu Hình Liên Kết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="linkType">Loại Liên Kết</Label>
              <Select value={formData.linkType} onValueChange={(linkType) => setFormData({ ...formData, linkType })}>
                <SelectTrigger id="linkType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="URL">URL Tùy Chỉnh</SelectItem>
                  <SelectItem value="PRODUCT_LIST">Danh Sách Sản Phẩm (Có Điều Kiện)</SelectItem>
                  <SelectItem value="PRODUCT_DETAIL">Chi Tiết Sản Phẩm</SelectItem>
                  <SelectItem value="BLOG_LIST">Danh Sách Bài Viết (Có Điều Kiện)</SelectItem>
                  <SelectItem value="BLOG_DETAIL">Chi Tiết Bài Viết</SelectItem>
                  <SelectItem value="CATEGORY">Danh Mục Sản Phẩm</SelectItem>
                  <SelectItem value="BLOG_CATEGORY">Danh Mục Bài Viết</SelectItem>
                  <SelectItem value="PAGE">Trang (Page Builder)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.linkType === 'URL' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="url">URL Nội Bộ</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="/san-pham"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="route">Route</Label>
                  <Input
                    id="route"
                    value={formData.route}
                    onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                    placeholder="/products"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="externalUrl">URL Bên Ngoài</Label>
                  <Input
                    id="externalUrl"
                    value={formData.externalUrl}
                    onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            ) : (
              <DynamicMenuLinkSelector
                linkType={formData.linkType}
                value={{
                  productId: formData.productId,
                  blogPostId: formData.blogPostId,
                  pageId: formData.pageId,
                  categoryId: formData.categoryId,
                  blogCategoryId: formData.blogCategoryId,
                  queryConditions: formData.queryConditions,
                }}
                onChange={handleDynamicLinkChange}
              />
            )}

            <div className="space-y-2">
              <Label htmlFor="target">Mở Liên Kết</Label>
              <Select value={formData.target} onValueChange={(target) => setFormData({ ...formData, target })}>
                <SelectTrigger id="target">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SELF">Cùng Tab</SelectItem>
                  <SelectItem value="BLANK">Tab Mới</SelectItem>
                  <SelectItem value="MODAL">Modal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Display */}
        <Card>
          <CardHeader>
            <CardTitle>Hiển Thị</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (Lucide)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="VD: ShoppingCart, Home"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL Hình Ảnh</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/icon.png"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="badge">Badge Text</Label>
                <Input
                  id="badge"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="VD: New, Hot"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="badgeColor">Badge Color</Label>
                <Input
                  id="badgeColor"
                  value={formData.badgeColor}
                  onChange={(e) => setFormData({ ...formData, badgeColor: e.target.value })}
                  placeholder="VD: red, blue, green"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cssClass">CSS Class</Label>
              <Input
                id="cssClass"
                value={formData.cssClass}
                onChange={(e) => setFormData({ ...formData, cssClass: e.target.value })}
                placeholder="custom-menu-class"
              />
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Cài Đặt</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive">Kích Hoạt</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="isVisible"
                checked={formData.isVisible}
                onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
              />
              <Label htmlFor="isVisible">Hiển Thị</Label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button type="submit" disabled={updating || loadingMenu} className="w-full sm:w-auto">
            {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Cập Nhật Menu
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
}
