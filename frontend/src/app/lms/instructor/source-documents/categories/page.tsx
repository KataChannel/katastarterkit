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

// Get status badge with approval state
const getStatusBadge = (doc: SourceDocument) => {
  // Determine approval state
  let approvalBadge = null;
  if (doc.rejectionReason) {
    approvalBadge = <Badge className="text-xs bg-red-100 text-red-800 border border-red-300">✕ Từ chối</Badge>;
  } else if (doc.approvedAt) {
    approvalBadge = <Badge className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300">✓ Đã duyệt</Badge>;
  } else if (doc.approvalRequested) {
    approvalBadge = <Badge className="text-xs bg-amber-100 text-amber-800 border border-amber-300">⏳ Chờ duyệt</Badge>;
  }

  // Status badge
  let statusBadge = null;
  switch (doc.status) {
    case 'PUBLISHED':
      statusBadge = <Badge className="text-xs bg-green-100 text-green-800 border">Đã xuất bản</Badge>;
      break;
    case 'DRAFT':
      statusBadge = <Badge className="text-xs bg-gray-100 text-gray-800 border">Nháp</Badge>;
      break;
    case 'PROCESSING':
      statusBadge = <Badge className="text-xs bg-blue-100 text-blue-800 border">Đang xử lý</Badge>;
      break;
    case 'ARCHIVED':
      statusBadge = <Badge className="text-xs bg-slate-100 text-slate-800 border">Lưu trữ</Badge>;
      break;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {statusBadge}
      {approvalBadge}
    </div>
  );
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
  approvalRequested?: boolean;
  approvedAt?: string;
  rejectionReason?: string;
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

export default function InstructorCategoriesPage() {
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
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-transparent dark:hover:from-purple-950/20 transition-all cursor-pointer group border-l-2 border-transparent hover:border-purple-400"
        style={{ marginLeft: `${(level + 1) * 24}px` }}
        onClick={() => router.push(`/lms/instructor/source-documents/${doc.id}`)}
      >
        {/* Thumbnail or type icon */}
        {doc.thumbnailUrl ? (
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
            <img
              src={doc.thumbnailUrl}
              alt={doc.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 text-purple-600 dark:text-purple-400 flex-shrink-0">
            {getDocumentTypeIcon(doc.type)}
          </div>
        )}

        {/* Document info */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate mb-1">
            {doc.title}
          </h4>
          {doc.fileName && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-1">
              {doc.fileName}
            </p>
          )}
          {/* Mobile badges */}
          <div className="sm:hidden">
            {getStatusBadge(doc)}
          </div>
        </div>

        {/* Desktop badges */}
        <div className="hidden sm:flex flex-col gap-1 items-end flex-shrink-0">
          {getStatusBadge(doc)}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 opacity-0 sm:opacity-100 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/lms/instructor/source-documents/${doc.id}`);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {doc.url && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex"
              onClick={(e) => {
                e.stopPropagation();
                window.open(doc.url, '_blank');
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderCategory = (category: Category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const hasDocuments = category.sourceDocuments && category.sourceDocuments.length > 0;
    const hasContent = hasChildren || hasDocuments;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id} className="mb-2">
        <div
          className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent dark:hover:from-gray-800/50 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 ${
            level > 0 ? '' : 'bg-white dark:bg-gray-900 shadow-sm'
          }`}
          style={{ marginLeft: `${level * 24}px` }}
        >
          {/* Expand/Collapse button */}
          {hasContent ? (
            <button
              onClick={() => toggleExpand(category.id)}
              className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          ) : (
            <div className="w-7 sm:w-8" />
          )}

          {/* Icon */}
          <div
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-sm flex-shrink-0"
            style={{ backgroundColor: `${category.color}20`, color: category.color }}
          >
            {category.icon}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100">
                {category.name}
              </h3>
              {hasDocuments && (
                <Badge 
                  className="text-xs w-fit"
                  style={{ 
                    backgroundColor: `${category.color}15`,
                    color: category.color,
                    borderColor: `${category.color}40`,
                    border: '1px solid'
                  }}
                >
                  {category.sourceDocuments!.length} tài liệu
                </Badge>
              )}
            </div>
            {category.description && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {category.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 sm:h-9 sm:w-9 p-0"
              onClick={() => handleEdit(category)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 sm:h-9 sm:w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleDelete(category)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Children and Documents */}
        {hasContent && isExpanded && (
          <div className="mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {/* Child categories first */}
            {hasChildren && category.children!.map((child) => renderCategory(child, level + 1))}
            
            {/* Then documents with subtle divider */}
            {hasDocuments && (
              <div className="space-y-1 pt-2" style={{ marginLeft: `${(level + 1) * 12}px` }}>
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
            Quản lý danh mục phân loại tài liệu của bạn
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
            <FolderTree className="w-5 h-5 text-purple-600" />
            <CardTitle>Cây danh mục</CardTitle>
          </div>
          <CardDescription>
            Click vào mũi tên để mở rộng/thu gọn danh mục con
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 text-purple-600 mx-auto animate-spin" />
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
                        ? 'border-purple-600 bg-purple-50'
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
                        ? 'border-purple-600 bg-purple-50'
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
