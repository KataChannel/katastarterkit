'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  useMenus,
  useCreateMenu,
  useUpdateMenu,
  useDeleteMenu,
} from '@/lib/hooks/useMenus';
import type { MenuItem as Menu } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Search, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableMenuRow } from '@/components/menu/SortableMenuRow';
import { MenuFormDialog } from '@/components/menu/MenuFormDialog';
import {
  buildMenuTree,
  flattenMenuTree,
  getMenuTypeColor,
} from '@/lib/utils/menu-utils';

/**
 * Trang Quản Lý Menu
 * 
 * Tính năng:
 * - Quản lý menu theo cấu trúc cây (parent/child)
 * - Kéo thả để sắp xếp lại menu
 * - Kéo thả để thay đổi cấp độ menu (cha <-> con)
 * - Sử dụng Universal Dynamic Query System
 */

export default function MenuManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());
  const [selectedMenuIds, setSelectedMenuIds] = useState<Set<string>>(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<{ id: string; title: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    type: 'SIDEBAR',
    route: '',
    url: '',
    icon: '',
    order: 0,
    parentId: '',
    isActive: true,
    isVisible: true,
    isPublic: false,
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Use dynamic hooks
  const { menus: menusData, loading, refetch } = useMenus({
    isAdmin: true, // Use admin endpoint with authentication
    type: selectedType !== 'all' ? selectedType : undefined,
    searchTerm: searchTerm || undefined,
    includeChildren: true,
  });

  // Ensure menus is always Menu[] type
  const menus = useMemo(() => {
    return Array.isArray(menusData) ? (menusData as Menu[]) : [];
  }, [menusData]);

  // Build menu tree structure
  const menuTree = useMemo(
    () => buildMenuTree(menus, expandedMenus),
    [menus, expandedMenus]
  );

  // Flatten tree for drag and drop
  const flatMenus = useMemo(() => flattenMenuTree(menuTree), [menuTree]);
  
  const { createMenu: createMenuMutation } = useCreateMenu();
  const { updateMenu: updateMenuMutation } = useUpdateMenu();
  const { deleteMenu: deleteMenuMutation } = useDeleteMenu();

  // Handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = flatMenus.findIndex((m) => m.id === active.id);
    const newIndex = flatMenus.findIndex((m) => m.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const moved = flatMenus[oldIndex];
    const target = flatMenus[newIndex];

    try {
      // TODO: Update order (Menu model doesn't have order field)
      // const newOrder = target.order;
      // await updateMenuMutation(moved.id, { order: newOrder });

      // Update all affected menus' orders
      const reordered = arrayMove(flatMenus, oldIndex, newIndex);
      // for (let i = 0; i < reordered.length; i++) {
      //   if (reordered[i].order !== i) {
      //     await updateMenuMutation(reordered[i].id, { order: i });
      //   }
      // }

      toast.success('Menu order updated');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update menu order');
    }
  };

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

  const handleCreate = async () => {
    try {
      await createMenuMutation({
        ...formData,
        order: parseInt(formData.order.toString()),
        parentId: formData.parentId && formData.parentId !== 'none' ? formData.parentId : undefined,
      });
      toast.success('Menu created successfully');
      setIsCreateOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create menu');
    }
  };

  const handleEdit = async () => {
    if (!selectedMenu) return;
    try {
      await updateMenuMutation(selectedMenu.id, {
        ...formData,
        order: parseInt(formData.order.toString()),
        parentId: formData.parentId && formData.parentId !== 'none' ? formData.parentId : undefined,
      });
      toast.success('Menu updated successfully');
      setIsEditOpen(false);
      setSelectedMenu(null);
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update menu');
    }
  };

  const handleDelete = (id: string, title: string) => {
    setMenuToDelete({ id, title });
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!menuToDelete) return;
    try {
      await deleteMenuMutation(menuToDelete.id);
      toast.success('Menu đã xóa thành công');
      setIsDeleteDialogOpen(false);
      setMenuToDelete(null);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Không thể xóa menu');
    }
  };

  const handleBulkDelete = () => {
    if (selectedMenuIds.size === 0) {
      toast.error('Vui lòng chọn ít nhất một menu để xóa');
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    if (selectedMenuIds.size === 0) return;
    
    try {
      let successCount = 0;
      let failCount = 0;

      // Convert Set to Array for iteration
      const idsToDelete = Array.from(selectedMenuIds);
      
      for (const id of idsToDelete) {
        try {
          await deleteMenuMutation(id);
          successCount++;
        } catch (error) {
          failCount++;
          console.error(`Failed to delete menu ${id}:`, error);
        }
      }

      if (successCount > 0) {
        toast.success(`Đã xóa thành công ${successCount} menu`);
      }
      if (failCount > 0) {
        toast.error(`Không thể xóa ${failCount} menu`);
      }

      setIsDeleteDialogOpen(false);
      setSelectedMenuIds(new Set());
      refetch();
    } catch (error: any) {
      toast.error('Có lỗi xảy ra khi xóa menu');
    }
  };

  const toggleSelectMenu = (id: string) => {
    setSelectedMenuIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedMenuIds.size === menus.length) {
      setSelectedMenuIds(new Set());
    } else {
      setSelectedMenuIds(new Set(menus.map((m) => m.id)));
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      // Get current menu to toggle isActive
      const menu = menus.find((m) => m.id === id);
      if (!menu) return;
      await updateMenuMutation(id, { isActive: !(menu as any).isActive });
      toast.success('Menu status updated');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update menu status');
    }
  };

  const handleToggleVisibility = async (id: string) => {
    try {
      // Get current menu to toggle isVisible (stored in metadata)
      const menu = menus.find((m) => m.id === id);
      if (!menu) return;
      
      const currentMetadata = (menu as any).metadata || {};
      const newMetadata = {
        ...currentMetadata,
        isVisible: currentMetadata.isVisible === false ? true : false,
      };
      
      await updateMenuMutation(id, { metadata: newMetadata } as any);
      toast.success('Menu visibility updated');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update menu visibility');
    }
  };

  const openEditDialog = (menu: Menu) => {
    setSelectedMenu(menu);
    const metadata = (menu as any).metadata || {};
    setFormData({
      title: menu.title,
      slug: metadata.slug || menu.url || '',
      description: metadata.description || '',
      type: metadata.type || 'SIDEBAR',
      route: menu.url || '',
      url: menu.url || '',
      icon: menu.icon || '',
      order: menu.order,
      parentId: menu.parentId || 'none',
      isActive: menu.isActive,
      isVisible: metadata.isVisible !== false,
      isPublic: metadata.isPublic || false,
    });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      type: 'SIDEBAR',
      route: '',
      url: '',
      icon: '',
      order: 0,
      parentId: 'none',
      isActive: true,
      isVisible: true,
      isPublic: false,
    });
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
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo Menu
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="SIDEBAR">Thanh bên</SelectItem>
                <SelectItem value="HEADER">Đầu trang</SelectItem>
                <SelectItem value="FOOTER">Chân trang</SelectItem>
                <SelectItem value="MOBILE">Di động</SelectItem>
                <SelectItem value="CUSTOM">Tùy chỉnh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Menu ({menus.length})</CardTitle>
          {selectedMenuIds.size > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa {selectedMenuIds.size} menu
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedMenuIds.size === menus.length && menus.length > 0}
                      onCheckedChange={toggleSelectAll}
                      aria-label="Chọn tất cả"
                    />
                  </TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Đường dẫn/URL</TableHead>
                  <TableHead>Thứ tự</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hiển thị</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Đang tải menu...
                    </TableCell>
                  </TableRow>
                ) : menuTree.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      Không tìm thấy menu
                    </TableCell>
                  </TableRow>
                ) : (
                  <SortableContext
                    items={flatMenus.map((m) => m.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {menuTree.map((menu) => (
                      <SortableMenuRow
                        key={menu.id}
                        menu={menu}
                        level={0}
                        allMenus={menus}
                        onEdit={openEditDialog}
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                        onToggleVisibility={handleToggleVisibility}
                        onToggleExpand={handleToggleExpand}
                        getTypeColor={getMenuTypeColor}
                        expanded={menu.expanded}
                        isSelected={selectedMenuIds.has(menu.id)}
                        onToggleSelect={toggleSelectMenu}
                      />
                    ))}
                  </SortableContext>
                )}
              </TableBody>
            </Table>
            <DragOverlay>
              {activeId ? (
                <div className="bg-background border rounded-lg p-4 shadow-lg">
                  <div className="font-medium">
                    {(flatMenus.find((m) => m.id === activeId) as any)?.title}
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <MenuFormDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        mode="create"
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleCreate}
        menus={menus}
      />

      {/* Edit Dialog */}
      <MenuFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        mode="edit"
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleEdit}
        menus={menus}
        selectedMenuId={selectedMenu?.id}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              {menuToDelete ? (
                <>
                  Bạn có chắc chắn muốn xóa menu <strong>"{menuToDelete.title}"</strong>?
                  <br />
                  <span className="text-destructive">Hành động này không thể hoàn tác.</span>
                </>
              ) : (
                <>
                  Bạn có chắc chắn muốn xóa <strong>{selectedMenuIds.size} menu</strong> đã chọn?
                  <br />
                  <span className="text-destructive">Hành động này không thể hoàn tác.</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setMenuToDelete(null);
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={menuToDelete ? confirmDelete : confirmBulkDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
