'use client';

import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_COURSES } from '@/graphql/lms/courses.graphql';
import { gql } from '@apollo/client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Plus,
  Edit,
  Eye,
  List,
  PlayCircle,
  HelpCircle,
  Loader2,
  AlertCircle,
  FileText,
  Trash2,
  Search,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
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

const DELETE_COURSE = gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`;

export default function AdminCoursesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'PUBLISHED' | 'DRAFT'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<any>(null);

  const { data, loading, error, refetch } = useQuery(GET_COURSES, {
    variables: {
      filters: {
        page: 1,
        limit: 100,
      }
    }
  });

  const [deleteCourse, { loading: deleteLoading }] = useMutation(DELETE_COURSE);

  // Filter courses
  const courses = data?.courses?.data || [];
  const filteredCourses = courses.filter((course: any) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (course.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || course.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteClick = (course: any) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;

    try {
      await deleteCourse({
        variables: { id: courseToDelete.id },
      });

      toast({
        title: 'Thành công',
        description: `Đã xóa khóa học "${courseToDelete.title}"`,
      });

      setDeleteDialogOpen(false);
      setCourseToDelete(null);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa khóa học',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-red-200">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <CardTitle>Lỗi tải dữ liệu</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {error.message || 'Có lỗi xảy ra khi tải khóa học'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Quản lý khóa học
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Quản lý tất cả khóa học trong hệ thống ({courses.length} khóa học)
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" className="gap-2">
                <Link href="/lms/admin/courses/create">
                  <Plus className="w-4 h-4" />
                  <span>Tạo thủ công</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-50">
                <Link href="/lms/admin/courses/create-from-documents">
                  <BookOpen className="w-4 h-4" />
                  <span>Từ tài liệu</span>
                </Link>
              </Button>
              <Button asChild className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Link href="/lms/admin/courses/create-with-ai">
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo với AI</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
              size="sm"
            >
              Tất cả
            </Button>
            <Button
              variant={filterStatus === 'PUBLISHED' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('PUBLISHED')}
              size="sm"
            >
              Đã xuất bản
            </Button>
            <Button
              variant={filterStatus === 'DRAFT' ? 'default' : 'outline'}
              onClick={() => setFilterStatus('DRAFT')}
              size="sm"
            >
              Nháp
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Danh sách khóa học</CardTitle>
            <CardDescription>
              {filteredCourses.length} khóa học
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {filteredCourses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                <div className="p-3 bg-muted rounded-lg mb-4">
                  <BookOpen className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Chưa có khóa học</h3>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Bắt đầu tạo khóa học đầu tiên
                </p>
                <Button asChild className="gap-2">
                  <Link href="/lms/admin/courses/create">
                    <Plus className="w-4 h-4" />
                    Tạo khóa học
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-semibold">Khóa học</th>
                      <th className="text-left py-3 px-4 font-semibold hidden sm:table-cell">Trạng thái</th>
                      <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Học viên</th>
                      <th className="text-left py-3 px-4 font-semibold hidden lg:table-cell">Tài liệu</th>
                      <th className="text-left py-3 px-4 font-semibold hidden lg:table-cell">Doanh thu</th>
                      <th className="text-right py-3 px-4 font-semibold">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredCourses.map((course: any) => (
                      <tr key={course.id} className="hover:bg-muted/50 transition-colors">
                        <td className="py-3 sm:py-4 px-4">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            {course.thumbnail ? (
                              <Image
                                src={course.thumbnail}
                                alt={course.title}
                                width={48}
                                height={36}
                                className="rounded w-12 h-9 object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-9 bg-muted rounded flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-5 h-5 text-muted-foreground" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm sm:text-base truncate">
                                {course.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {course.level} • {course.instructor?.firstName} {course.instructor?.lastName || course.instructor?.username}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-4 hidden sm:table-cell">
                          <Badge
                            variant={
                              course.status === 'PUBLISHED'
                                ? 'default'
                                : course.status === 'DRAFT'
                                ? 'secondary'
                                : 'outline'
                            }
                            className="text-xs"
                          >
                            {course.status === 'PUBLISHED'
                              ? 'Đã xuất bản'
                              : course.status === 'DRAFT'
                              ? 'Bản nháp'
                              : course.status}
                          </Badge>
                        </td>
                        <td className="py-3 sm:py-4 px-4 hidden md:table-cell">
                          <p className="text-sm">{course.enrollmentCount || 0}</p>
                        </td>
                        <td className="py-3 sm:py-4 px-4 hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-sm">
                            <FileText className="w-4 h-4 text-green-600" />
                            <span>{course.sourceDocumentsCount || 0}</span>
                          </div>
                        </td>
                        <td className="py-3 sm:py-4 px-4 hidden lg:table-cell">
                          <p className="text-sm font-medium">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format((course.price || 0) * (course.enrollmentCount || 0))}
                          </p>
                        </td>
                        <td className="py-3 sm:py-4 px-4">
                          <div className="flex items-center justify-end gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              title="Xem"
                              className="h-8 w-8 p-0"
                            >
                              <Link href={`/lms/courses/${course.slug}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              title="Quản lý"
                              className="h-8 w-8 p-0"
                            >
                              <Link href={`/lms/admin/courses/${course.id}/manage`}>
                                <List className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              title="Bài học"
                              className="h-8 w-8 p-0"
                            >
                              <Link href={`/lms/admin/courses/${course.id}/lessons`}>
                                <PlayCircle className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              title="Quiz"
                              className="h-8 w-8 p-0"
                            >
                              <Link href={`/lms/admin/courses/${course.id}/quizzes`}>
                                <HelpCircle className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              asChild
                              title="Sửa"
                              className="h-8 w-8 p-0"
                            >
                              <Link href={`/lms/admin/courses/${course.id}/edit`}>
                                <Edit className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Xóa"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteClick(course)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa khóa học</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khóa học <strong>&quot;{courseToDelete?.title}&quot;</strong>?
              <br />
              <br />
              <span className="text-red-600 font-semibold">
                Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.
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
