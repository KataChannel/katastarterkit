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
  BookOpen,
  Users,
  Mail,
  Phone,
  MoreVertical,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface Instructor {
  id: string;
  username: string;
  email: string;
  phoneNumber: string;
  roleType: string;
  isActive: boolean;
  createdCourses: {
    id: string;
    title: string;
    isPublished: boolean;
  }[];
  _count: {
    createdCourses: number;
  };
  createdAt: string;
}

export default function AdminInstructorsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: instructors = [], loading, error } = useFindMany<Instructor>('User', {
    where: {
      roleType: 'GIANGVIEN'
    },
    include: {
      createdCourses: {
        select: {
          id: true,
          title: true,
          isPublished: true,
        }
      },
      _count: {
        select: {
          createdCourses: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  const filteredInstructors = instructors.filter(instructor =>
    instructor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý giảng viên</h1>
          <p className="text-gray-600 mt-1">Tổng cộng {instructors.length} giảng viên</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Thêm giảng viên
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Tìm kiếm giảng viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Instructors List */}
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
      ) : filteredInstructors.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Chưa có giảng viên nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredInstructors.map((instructor) => (
            <Card key={instructor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {instructor.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {instructor.username}
                        {instructor.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <Badge variant="outline" className="mr-2">GIẢNG VIÊN</Badge>
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{instructor.email}</span>
                  </div>
                  {instructor.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{instructor.phoneNumber}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xl font-bold">{instructor._count?.createdCourses || 0}</p>
                      <p className="text-xs text-gray-500">Khóa học</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xl font-bold">0</p>
                      <p className="text-xs text-gray-500">Học viên</p>
                    </div>
                  </div>
                </div>

                {/* Courses Preview */}
                {instructor.createdCourses && instructor.createdCourses.length > 0 && (
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Khóa học đang dạy:</p>
                    <div className="space-y-1">
                      {instructor.createdCourses.slice(0, 3).map((course) => (
                        <div key={course.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 truncate flex-1">{course.title}</span>
                          <Badge variant={course.isPublished ? 'default' : 'secondary'} className="ml-2 text-xs">
                            {course.isPublished ? 'Public' : 'Draft'}
                          </Badge>
                        </div>
                      ))}
                      {instructor.createdCourses.length > 3 && (
                        <p className="text-xs text-gray-500">+{instructor.createdCourses.length - 3} khóa khác</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Edit className="w-4 h-4" />
                    Chỉnh sửa
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <BookOpen className="w-4 h-4" />
                    Xem khóa học
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
