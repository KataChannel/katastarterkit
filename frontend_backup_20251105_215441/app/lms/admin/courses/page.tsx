'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFindMany, useDeleteOne, useUpdateOne } from '@/hooks/useDynamicGraphQL';
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
  AlertCircle,
  BookOpen
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  price: number;
  duration: number;
  thumbnailUrl: string;
  status: string;
  instructor: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  _count: {
    enrollments: number;
    modules: number;
    reviews: number;
  };
  createdAt: string;
}

export default function AdminCoursesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<any>(null);

  const { data: courses, loading, error, refetch } = useFindMany('Course', {
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      level: true,
      price: true,
      thumbnail: true,
      status: true,
      createdAt: true,
      duration: true,
    },
    include: {
      _count: {
        select: {
          enrollments: true,
          modules: true,
          reviews: true,
        },
      },
      instructor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const [deleteCourse, { loading: deleteLoading }] = useDeleteOne('Course');
  const [updateCourse] = useUpdateOne('Course');

  // Filter courses
  const filteredCourses = (courses || []).filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (course.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && course.status === 'PUBLISHED') ||
                         (filterStatus === 'draft' && course.status === 'DRAFT');
    return matchesSearch && matchesFilter;
  });

  // Handlers
  const handleCreateCourse = () => {
    router.push('/lms/admin/courses/create');
  };

  const handleViewCourse = (courseId: string) => {
    router.push(`/lms/admin/courses/${courseId}`);
  };

  const handleEditCourse = (courseId: string) => {
    router.push(`/lms/admin/courses/${courseId}/edit`);
  };

  const handleDeleteClick = (course: any) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;

    try {
      await deleteCourse({
        where: { id: courseToDelete.id },
      });

      toast({
        title: 'Thành công',
        description: `Đã xóa khóa học "${courseToDelete.title}"`,
        type: 'success',
      });

      setDeleteDialogOpen(false);
      setCourseToDelete(null);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa khóa học',
        type: 'error',
      });
    }
  };

  const handleTogglePublish = async (course: any) => {
    try {
      const newStatus = course.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
      await updateCourse({
        where: { id: course.id },
        data: {
          status: newStatus,
        },
      });

      toast({
        title: 'Thành công',
        description: `Đã ${newStatus === 'PUBLISHED' ? 'xuất bản' : 'chuyển về nháp'} khóa học "${course.title}"`,
        type: 'success',
      });

      refetch();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật trạng thái',
        type: 'error',
      });
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý khóa học</h1>
          <p className="text-gray-600 mt-1">Tổng cộng {courses?.length || 0} khóa học</p>
        </div>
        <Button onClick={handleCreateCourse} className="gap-2">
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
          >
            Tất cả
          </Button>
          <Button
            variant={filterStatus === 'published' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('published')}
          >
            Đã xuất bản
          </Button>
          <Button
            variant={filterStatus === 'draft' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('draft')}
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
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Lỗi: {error.message}</p>
          </CardContent>
        </Card>
      ) : filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy khóa học nào</p>
            <Button onClick={handleCreateCourse} className="mt-4">
              Tạo khóa học đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge 
                    variant={course.status === 'PUBLISHED' ? 'default' : 'secondary'}
                    className="cursor-pointer"
                    onClick={() => handleTogglePublish(course)}
                  >
                    {course.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Nháp'}
                  </Badge>
                  <Badge variant="outline">
                    {course.level || 'Beginner'}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="mt-2 line-clamp-2">
                  {course.description || 'Chưa có mô tả'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Instructor */}
                {course.instructor && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Giảng viên: {course.instructor.firstName && course.instructor.lastName 
                      ? `${course.instructor.firstName} ${course.instructor.lastName}` 
                      : course.instructor.username}</span>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course._count?.enrollments || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{course._count?.modules || 0} modules</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration || 0}p</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{course._count?.reviews || 0}</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-lg font-bold text-blue-600">
                  {course.price ? formatPrice(course.price) : 'Miễn phí'}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-2"
                    onClick={() => handleViewCourse(course.id)}
                  >
                    <Eye className="w-4 h-4" />
                    Xem
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-2"
                    onClick={() => handleEditCourse(course.id)}
                  >
                    <Edit className="w-4 h-4" />
                    Sửa
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteClick(course)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa khóa học</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khóa học <strong>&quot;{courseToDelete?.title}&quot;</strong>?
              <br />
              <br />
              <span className="text-red-600 font-semibold">
                Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan (bài học, quiz, enrollment, v.v.)
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? 'Đang xóa...' : 'Xóa khóa học'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
