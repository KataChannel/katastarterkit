'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  FolderTree,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Search,
  Eye,
  FolderOpen,
} from 'lucide-react';
import {
  GET_COURSE_CATEGORY_TREE,
} from '@/graphql/lms/courses.graphql';

// Default colors for categories
const DEFAULT_COLORS = [
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#10B981', // green
  '#F59E0B', // orange
  '#EF4444', // red
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#6366F1', // indigo
];

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentId?: string;
  children?: Category[];
  _count?: {
    courses: number;
  };
}

export default function InstructorCourseCategoriesPage() {
  const router = useRouter();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Query
  const { data, loading, error } = useQuery(GET_COURSE_CATEGORY_TREE, {
    fetchPolicy: 'cache-and-network',
  });

  const categories = data?.courseCategoryTree || [];

  // Get a consistent color for category based on index
  const getCategoryColor = (categoryId: string) => {
    const index = categoryId.charCodeAt(0) % DEFAULT_COLORS.length;
    return DEFAULT_COLORS[index];
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

  // Filter categories based on search
  const filterCategories = (cats: Category[]): Category[] => {
    if (!searchQuery) return cats;
    
    return cats.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cat.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      const hasMatchingChildren = cat.children && filterCategories(cat.children).length > 0;
      return matchesSearch || hasMatchingChildren;
    }).map(cat => ({
      ...cat,
      children: cat.children ? filterCategories(cat.children) : []
    }));
  };

  const filteredCategories = filterCategories(categories);

  const renderCategory = (category: Category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);
    const color = getCategoryColor(category.id);
    const icon = category.icon || '📁';

    return (
      <div key={category.id} className="mb-2">
        <div
          className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent dark:hover:from-gray-800/50 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 ${
            level > 0 ? '' : 'bg-white dark:bg-gray-900 shadow-sm'
          }`}
          style={{ marginLeft: `${level * 24}px` }}
        >
          {/* Expand/Collapse button */}
          {hasChildren ? (
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
            style={{ backgroundColor: `${color}20`, color: color }}
          >
            {icon}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100">
                {category.name}
              </h3>
              {category._count && category._count.courses > 0 && (
                <Badge 
                  className="text-xs w-fit"
                  style={{ 
                    backgroundColor: `${color}15`,
                    color: color,
                    borderColor: `${color}40`,
                    border: '1px solid'
                  }}
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  {category._count.courses} khóa học
                </Badge>
              )}
            </div>
            {category.description && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                {category.description}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">/{category.slug}</p>
          </div>

          {/* View courses in category */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 sm:h-9 sm:w-9 p-0"
              onClick={() => router.push(`/lms/instructor/courses?category=${category.slug}`)}
              title="Xem khóa học trong danh mục"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
            {category.children!.map((child) => renderCategory(child, level + 1))}
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
            Danh mục khóa học
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Xem danh mục phân loại khóa học
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm danh mục..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
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
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {searchQuery ? 'Không tìm thấy danh mục phù hợp' : 'Chưa có danh mục nào'}
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredCategories.map((category: Category) => renderCategory(category))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
