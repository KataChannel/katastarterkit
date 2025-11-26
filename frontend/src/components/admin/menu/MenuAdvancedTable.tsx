'use client';

import React, { useMemo } from 'react';
import { AdvancedTable, ColumnDef, TableConfig } from '@/components/ui/advanced-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Power,
  PowerOff,
  FolderTree,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Menu } from '@/lib/graphql/menu-dynamic-queries';

interface MenuTreeItem {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  type: string;
  parentId?: string | null;
  order: number;
  level: number;
  path?: string | null;
  isActive: boolean;
  isVisible: boolean;
  icon?: string | null;
  target?: string | null;
  hasChildren?: boolean;
  expanded?: boolean;
  parentTitle?: string;
}

interface MenuAdvancedTableProps {
  menus: Menu[];
  loading?: boolean;
  onDelete: (id: string, title: string) => void;
  onToggleActive: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  expandedMenus: Set<string>;
  onToggleExpand: (id: string) => void;
}

export function MenuAdvancedTable({
  menus,
  loading,
  onDelete,
  onToggleActive,
  onToggleVisibility,
  expandedMenus,
  onToggleExpand,
}: MenuAdvancedTableProps) {
  const router = useRouter();

  // Build menu tree structure
  const menuTree = useMemo(() => {
    const buildTree = (
      items: Menu[],
      parentId: string | null = null,
      level: number = 0,
      parentTitle: string = ''
    ): MenuTreeItem[] => {
      const children = items.filter((item) => item.parentId === parentId);
      const result: MenuTreeItem[] = [];

      children.forEach((item) => {
        const hasChildren = items.some((m) => m.parentId === item.id);
        const expanded = expandedMenus.has(item.id);

        result.push({
          ...item,
          level,
          hasChildren,
          expanded,
          parentTitle: parentTitle || undefined,
        });

        if (hasChildren && expanded) {
          result.push(...buildTree(items, item.id, level + 1, item.title));
        }
      });

      return result;
    };

    return buildTree(menus);
  }, [menus, expandedMenus]);

  // Helper functions
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      SIDEBAR: 'bg-blue-100 text-blue-800',
      HEADER: 'bg-purple-100 text-purple-800',
      FOOTER: 'bg-gray-100 text-gray-800',
      MOBILE: 'bg-green-100 text-green-800',
      CUSTOM: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      SIDEBAR: 'Thanh bên',
      HEADER: 'Đầu trang',
      FOOTER: 'Chân trang',
      MOBILE: 'Di động',
      CUSTOM: 'Tùy chỉnh',
    };
    return labels[type] || type;
  };

  // Column definitions
  const columns: ColumnDef<MenuTreeItem>[] = useMemo(() => [
    {
      field: 'title',
      headerName: 'Tiêu đề',
      width: 300,
      pinned: 'left',
      sortable: true,
      filterable: true,
      cellRenderer: ({ data }) => (
        <div className="flex items-center gap-2" style={{ paddingLeft: `${(data.level || 0) * 24}px` }}>
          {data.hasChildren && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(data.id);
              }}
            >
              {data.expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          {!data.hasChildren && <div className="w-6" />}
          <FolderTree className={`h-4 w-4 ${data.level ? 'text-gray-400' : 'text-blue-500'}`} />
          <span className="font-medium">{data.title}</span>
          {data.parentTitle && (
            <Badge variant="outline" className="ml-2 text-xs">
              {data.parentTitle}
            </Badge>
          )}
        </div>
      ),
    },
    {
      field: 'type',
      headerName: 'Loại',
      width: 150,
      sortable: true,
      filterable: true,
      type: 'select',
      filterOptions: ['SIDEBAR', 'HEADER', 'FOOTER', 'MOBILE', 'CUSTOM'],
      cellRenderer: ({ data }) => (
        <Badge className={getTypeColor(data.type)}>
          {getTypeLabel(data.type)}
        </Badge>
      ),
    },
    {
      field: 'slug',
      headerName: 'Đường dẫn',
      width: 250,
      sortable: true,
      filterable: true,
      cellRenderer: ({ data }) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{data.slug}</code>
      ),
    },
    {
      field: 'order',
      headerName: 'Thứ tự',
      width: 100,
      sortable: true,
      type: 'number',
      cellRenderer: ({ data }) => (
        <span className="font-mono text-sm">{data.order}</span>
      ),
    },
    {
      field: 'isActive',
      headerName: 'Hoạt động',
      width: 120,
      sortable: true,
      filterable: true,
      type: 'boolean',
      cellRenderer: ({ data }) => (
        <div className="flex items-center gap-2">
          {data.isActive ? (
            <>
              <Power className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">Bật</span>
            </>
          ) : (
            <>
              <PowerOff className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Tắt</span>
            </>
          )}
        </div>
      ),
    },
    {
      field: 'isVisible',
      headerName: 'Hiển thị',
      width: 120,
      sortable: true,
      filterable: true,
      type: 'boolean',
      cellRenderer: ({ data }) => (
        <div className="flex items-center gap-2">
          {data.isVisible ? (
            <>
              <Eye className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-600 font-medium">Hiện</span>
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Ẩn</span>
            </>
          )}
        </div>
      ),
    },
    {
      field: 'id',
      headerName: 'Thao tác',
      width: 100,
      pinned: 'right',
      cellRenderer: ({ data }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/admin/menu/${data.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleActive(data.id)}>
              {data.isActive ? (
                <>
                  <PowerOff className="mr-2 h-4 w-4" />
                  Tắt hoạt động
                </>
              ) : (
                <>
                  <Power className="mr-2 h-4 w-4" />
                  Bật hoạt động
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleVisibility(data.id)}>
              {data.isVisible ? (
                <>
                  <EyeOff className="mr-2 h-4 w-4" />
                  Ẩn menu
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Hiện menu
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(data.id, data.title)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ], [router, onToggleExpand, onToggleActive, onToggleVisibility, onDelete]);

  // Table configuration
  const config: TableConfig = {
    enableSorting: true,
    enableFiltering: true,
    enableColumnPinning: true,
    enableColumnResizing: true,
    showToolbar: true,
    showPagination: false, // We're using tree structure, pagination doesn't make sense
    enableRowSelection: false,
  };

  return (
    <AdvancedTable<MenuTreeItem>
      columns={columns}
      data={menuTree}
      config={config}
      loading={loading}
    />
  );
}
