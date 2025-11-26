'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  useMenus,
  useUpdateMenu,
  useDeleteMenu,
} from '@/lib/hooks/useMenus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { MenuAdvancedTable } from '@/components/admin/menu/MenuAdvancedTable';

/**
 * Trang Quản Lý Menu
 * 
 * Tính năng:
 * - Quản lý menu theo cấu trúc cây (parent/child)
 * - Advanced Table với sort, filter, export
 * - Expand/collapse để xem cấu trúc menu
 * - Sử dụng Universal Dynamic Query System
 */

export default function MenuManagementPage() {
  const router = useRouter();
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  // Use dynamic hooks
  const { menus: menusData, loading, refetch } = useMenus({
    orderBy: { order: 'asc' },
  });

  // Ensure menus is always array
  const menus = useMemo(() => {
    return Array.isArray(menusData) ? menusData : [];
  }, [menusData]);
  
  const { updateMenu: updateMenuMutation } = useUpdateMenu();
  const { deleteMenu: deleteMenuMutation } = useDeleteMenu();

  // Handlers
  const handleToggleExpand = (id: string) => {
    setExpandedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa menu "${title}"?`)) return;
    try {
      await deleteMenuMutation(id);
      toast.success('Đã xóa menu thành công');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi xóa menu');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      const menu = menus.find((m) => m.id === id);
      if (!menu) return;
      await updateMenuMutation(id, { isActive: !menu.isActive });
      toast.success('Đã cập nhật trạng thái menu');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi cập nhật menu');
    }
  };

  const handleToggleVisibility = async (id: string) => {
    try {
      const menu = menus.find((m) => m.id === id);
      if (!menu) return;
      await updateMenuMutation(id, { isVisible: !menu.isVisible });
      toast.success('Đã cập nhật hiển thị menu');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi cập nhật menu');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Menu</h1>
          <p className="text-muted-foreground">
            Quản lý menu và điều hướng ứng dụng của bạn
          </p>
        </div>
        <Button onClick={() => router.push('/admin/menu/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo Menu Mới
        </Button>
      </div>

      {/* Advanced Table */}
      <Card>
        <CardHeader>
          <CardTitle>Menu ({menus.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <MenuAdvancedTable
            menus={menus}
            loading={loading}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
            onToggleVisibility={handleToggleVisibility}
            expandedMenus={expandedMenus}
            onToggleExpand={handleToggleExpand}
          />
        </CardContent>
      </Card>
    </div>
  );
}
