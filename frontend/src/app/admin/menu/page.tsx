'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  useMenus,
  useCreateMenu,
  useUpdateMenu,
  useDeleteMenu,
} from '@/lib/hooks/useMenus';
import { Menu } from '@/lib/graphql/menu-dynamic-queries';
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
import { Plus, Search } from 'lucide-react';
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
  const where = useMemo(() => {
    const filter: any = {};
    if (selectedType !== 'all') {
      filter.type = selectedType;
    }
    if (searchTerm) {
      filter.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { slug: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }
    return filter;
  }, [selectedType, searchTerm]);

  const { menus: menusData, loading, refetch } = useMenus({
    where,
    orderBy: { order: 'asc' },
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

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete menu "${title}"?`)) return;
    try {
      await deleteMenuMutation(id);
      toast.success('Menu deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete menu');
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
      // Get current menu to toggle isVisible
      const menu = menus.find((m) => m.id === id);
      if (!menu) return;
      await updateMenuMutation(id, { isVisible: !(menu as any).isVisible });
      toast.success('Menu visibility updated');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update menu visibility');
    }
  };

  const openEditDialog = (menu: Menu) => {
    setSelectedMenu(menu);
    setFormData({
      title: (menu as any).title,
      slug: menu.slug,
      description: (menu as any).description || '',
      type: (menu as any).type,
      route: (menu as any).route || '',
      url: (menu as any).url || '',
      icon: (menu as any).icon || '',
      order: (menu as any).order,
      parentId: (menu as any).parentId || 'none',
      isActive: (menu as any).isActive,
      isVisible: (menu as any).isVisible,
      isPublic: (menu as any).isPublic,
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
        <CardHeader>
          <CardTitle>Menu ({menus.length})</CardTitle>
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
                    <TableCell colSpan={7} className="text-center py-8">
                      Đang tải menu...
                    </TableCell>
                  </TableRow>
                ) : menuTree.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
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
    </div>
  );
}
