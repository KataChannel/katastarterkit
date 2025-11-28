'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  FolderTree,
  ChevronRight,
  ChevronDown,
  FileText,
  FileVideo,
  FileAudio,
  Link as LinkIcon,
  ExternalLink,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  GET_SOURCE_DOCUMENT_CATEGORY_TREE,
  CREATE_SOURCE_DOCUMENT_CATEGORY,
  UPDATE_SOURCE_DOCUMENT_CATEGORY,
  DELETE_SOURCE_DOCUMENT_CATEGORY,
} from '@/graphql/lms/source-documents';

// Icon picker (simplified - using emojis)
const ICON_OPTIONS = [
  '📁', '📂', '📚', '📖', '📝', '📄', '📃', '📑',
  '🎥', '🎬', '🎞️', '📹', '🎵', '🎶', '🎧', '🔊',
  '🖼️', '🖌️', '🎨', '🌈', '💡', '🔬', '🔭', '⚗️',
  '💻', '⌨️', '🖥️', '📱', '🌐', '🔗', '📡', '🛰️',
];

// Color picker (simplified)
const COLOR_OPTIONS = [
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#10B981', // green
  '#F59E0B', // orange
  '#EF4444', // red
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#6366F1', // indigo
];

// Get icon for document type
const getDocumentTypeIcon = (type: string) => {
  switch (type) {
    case 'VIDEO':
      return <FileVideo className="w-4 h-4" />;
    case 'AUDIO':
      return <FileAudio className="w-4 h-4" />;
    case 'LINK':
      return <LinkIcon className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

// Get status badge style
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Đã xuất bản</Badge>;
    case 'DRAFT':
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">Nháp</Badge>;
    case 'PENDING':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Chờ duyệt</Badge>;
    case 'REJECTED':
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Từ chối</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

interface SourceDocument {
  id: string;
  title: string;
  type: string;
  status: string;
  fileName?: string;
  url?: string;
  thumbnailUrl?: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  parentId?: string;
  children?: Category[];
  sourceDocuments?: SourceDocument[];
}

export default function CategoriesPage() {
  const router = useRouter();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '📁',
    color: '#3B82F6',
    parentId: '',
  });

  // Queries
  const { data, loading, error, refetch } = useQuery(GET_SOURCE_DOCUMENT_CATEGORY_TREE, {
    fetchPolicy: 'cache-and-network',
  });

  // Mutations
  const [createCategory, { loading: creating }] = useMutation(CREATE_SOURCE_DOCUMENT_CATEGORY, {
    onCompleted: () => {
      toast.success('Đã tạo danh mục mới');
      setCreateDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [updateCategory, { loading: updating }] = useMutation(UPDATE_SOURCE_DOCUMENT_CATEGORY, {
    onCompleted: () => {
      toast.success('Đã cập nhật danh mục');
      setEditDialogOpen(false);
      resetForm();
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [deleteCategory, { loading: deleting }] = useMutation(DELETE_SOURCE_DOCUMENT_CATEGORY, {
    onCompleted: () => {
      toast.success('Đã xóa danh mục');
      setDeleteDialogOpen(false);
      setSelectedCategory(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const categories = data?.sourceDocumentCategoryTree || [];

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '📁',
      color: '#3B82F6',
      parentId: '',
    });
  };

  const handleCreate = () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error('Vui lòng nhập tên và slug');
      return;
    }

    createCategory({
      variables: {
        input: {
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          icon: formData.icon,
          color: formData.color,
          parentId: formData.parentId || null,
        },
      },
    });
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      icon: category.icon || '📁',
      color: category.color || '#3B82F6',
      parentId: category.parentId || '',
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedCategory || !formData.name.trim() || !formData.slug.trim()) {
      toast.error('Vui lòng nhập tên và slug');
      return;
    }

    updateCategory({
      variables: {
        id: selectedCategory.id,
        input: {
          name: formData.name,
          slug: formData.slug,
          description: formData.description || null,
          icon: formData.icon,
          color: formData.color,
          parentId: formData.parentId || null,
        },
      },
    });
  };

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      deleteCategory({ variables: { id: selectedCategory.id } });
    }
  };

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Render a document item inside the tree
  const renderDocument = (doc: SourceDocument, level: number) => {
    return (
      <div
        key={doc.id}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer group"
        style={{ paddingLeft: `${(level + 1) * 24 + 12}px` }}
        onClick={() => router.push(`/lms/admin/source-documents/${doc.id}`)}
      >
        {/* Empty space for alignment */}
        <div className="w-6" />
        
        {/* Document type icon */}
        <div className="w-8 h-8 rounded flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
          {getDocumentTypeIcon(doc.type)}
        </div>

        {/* Document info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {doc.title}
          </h4>
          {doc.fileName && (
            <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
              {doc.fileName}
            </p>
          )}
        </div>

        {/* Status badge */}
        <div className="hidden sm:block">
          {getStatusBadge(doc.status)}
        </div>

        {/* Action button */}
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/lms/admin/source-documents/${doc.id}`);
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const renderCategory = (category: Category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const hasDocuments = category.sourceDocuments && category.sourceDocuments.length > 0;
    const hasContent = hasChildren || hasDocuments;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id}>
        <div
          className={`flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
            level > 0 ? 'ml-6' : ''
          }`}
          style={{ paddingLeft: `${level * 24 + 12}px` }}
        >
          {/* Expand/Collapse button */}
          {hasContent ? (
            <button
              onClick={() => toggleExpand(category.id)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}

          {/* Icon */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: `${category.color}20`, color: category.color }}
          >
            {category.icon}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
                {category.name}
              </h3>
              {hasDocuments && (
                <Badge variant="secondary" className="text-xs">
                  {category.sourceDocuments!.length} tài liệu
                </Badge>
              )}
            </div>
            {category.description && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                {category.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(category)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(category)}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </div>
        </div>

        {/* Children and Documents */}
        {hasContent && isExpanded && (
          <div className="mt-1 space-y-1">
            {/* Child categories first */}
            {hasChildren && category.children!.map((child) => renderCategory(child, level + 1))}
            
            {/* Then documents */}
            {hasDocuments && (
              <div className="border-l-2 border-gray-200 dark:border-gray-700 ml-6" style={{ marginLeft: `${(level + 1) * 24 + 6}px` }}>
                {category.sourceDocuments!.map((doc) => renderDocument(doc, level))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Danh mục tài liệu nguồn
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Quản lý danh mục phân loại tài liệu
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      {/* Categories Tree */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-blue-600" />
            <CardTitle>Cây danh mục</CardTitle>
          </div>
          <CardDescription>
            Click vào mũi tên để mở rộng/thu gọn danh mục con
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-blue-600 mx-auto animate-spin" />
              <p className="text-gray-500 mt-4">Đang tải...</p>
            </div>
          ) : error ? (
            <p className="text-red-600 text-center py-8">Lỗi: {error.message}</p>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <FolderTree className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Chưa có danh mục nào</p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo danh mục đầu tiên
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {categories.map((category: Category) => renderCategory(category))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo danh mục mới</DialogTitle>
            <DialogDescription>
              Điền thông tin danh mục
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên danh mục *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên danh mục..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="category-slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả danh mục..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-8 gap-2">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`p-2 text-xl rounded border-2 transition-colors ${
                      formData.icon === icon
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Màu sắc</Label>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-full border-2 transition-transform ${
                      formData.color === color
                        ? 'border-gray-800 scale-110'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                resetForm();
              }}
              disabled={creating}
            >
              Hủy
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                'Tạo danh mục'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin danh mục
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên danh mục *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên danh mục..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug *</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="category-slug"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả danh mục..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-8 gap-2">
                {ICON_OPTIONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`p-2 text-xl rounded border-2 transition-colors ${
                      formData.icon === icon
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Màu sắc</Label>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded-full border-2 transition-transform ${
                      formData.color === color
                        ? 'border-gray-800 scale-110'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                resetForm();
              }}
              disabled={updating}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdate} disabled={updating}>
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                'Cập nhật'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa danh mục "{selectedCategory?.name}"?
              <br />
              <span className="text-red-600 font-medium">
                Các danh mục con (nếu có) cũng sẽ bị xóa!
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                'Xóa'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
