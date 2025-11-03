'use client';

import { useState } from 'react';
import { useFindMany } from '@/hooks/useDynamicGraphQL';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Clock,
  Star,
  Filter,
  MoreVertical
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  price: number;
  duration: number;
  thumbnailUrl: string;
  isPublished: boolean;
  instructor: {
    id: string;
    username: string;
    email: string;
  };
  _count: {
    enrollments: number;
    modules: number;
    reviews: number;
  };
  createdAt: string;
}

export default function AdminCoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, published, draft

  const { data: courses = [], loading, error, refetch } = useFindMany<Course>('Course', {
    include: {
      instructor: {
        select: {
          id: true,
          username: true,
          email: true,
        }
      },
      _count: {
        select: {
          enrollments: true,
          modules: true,
          reviews: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'published' && course.isPublished) ||
                         (filter === 'draft' && !course.isPublished);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khóa học</h1>
          <p className="text-gray-600 mt-1">Tổng cộng {courses.length} khóa học</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Tạo khóa học mới
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </Button>
          <Button
            variant={filter === 'published' ? 'default' : 'outline'}
            onClick={() => setFilter('published')}
          >
            Đã xuất bản
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            onClick={() => setFilter('draft')}
          >
            Nháp
          </Button>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Đang tải...</p>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600">Lỗi: {error.message}</p>
          </CardContent>
        </Card>
      ) : filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Không tìm thấy khóa học nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge variant={course.isPublished ? 'default' : 'secondary'} className="mb-2">
                      {course.isPublished ? 'Đã xuất bản' : 'Nháp'}
                    </Badge>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {course.description}
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Instructor */}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Giảng viên: {course.instructor?.username || 'Chưa có'}</span>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course._count?.enrollments || 0} học viên</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration || 0}h</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{course._count?.reviews || 0}</span>
                  </div>
                </div>

                {/* Level & Price */}
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{course.level || 'Beginner'}</Badge>
                  <span className="font-bold text-blue-600">
                    {course.price > 0 ? `${course.price.toLocaleString()}đ` : 'Miễn phí'}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="w-4 h-4" />
                    Xem
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Edit className="w-4 h-4" />
                    Sửa
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
