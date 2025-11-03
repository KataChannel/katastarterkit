'use client';

import { useState } from 'react';
import { useFindMany, useCreateOne, useUpdateOne, useDeleteOne } from '@/hooks/useDynamicGraphQL';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  XCircle,
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Switch } from '@/components/ui/switch';

interface Instructor {
  id: string;
  username: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatar: string;
  roleType: string;
  isActive: boolean;
  coursesInstructed: {
    id: string;
    title: string;
    status: string;
  }[];
  _count: {
    coursesInstructed: number;
  };
  createdAt: string;
}

export default function AdminInstructorsPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    firstName: '',
    lastName: '',
    isActive: true,
  });

  const { data: instructors = [], loading, error, refetch } = useFindMany<Instructor>('User', {
    where: {
      roleType: 'GIANGVIEN'
    },
    select: {
      id: true,
      username: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      avatar: true,
      roleType: true,
      isActive: true,
      createdAt: true,
    },
    include: {
      coursesInstructed: {
        select: {
          id: true,
          title: true,
          status: true,
        }
      },
      _count: {
        select: {
          coursesInstructed: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
  });

  const [createInstructor, { loading: createLoading }] = useCreateOne('User');
  const [updateInstructor, { loading: updateLoading }] = useUpdateOne('User');
  const [deleteInstructor, { loading: deleteLoading }] = useDeleteOne('User');

  const filteredInstructors = instructors.filter(instructor =>
    instructor.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (instructor.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (instructor.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (instructor.lastName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      phone: '',
      firstName: '',
      lastName: '',
      isActive: true,
    });
  };

  const handleCreateClick = () => {
    resetForm();
    setCreateDialogOpen(true);
  };

  const handleEditClick = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setFormData({
      username: instructor.username,
      email: instructor.email || '',
      password: '',
      phone: instructor.phone || '',
      firstName: instructor.firstName || '',
      lastName: instructor.lastName || '',
      isActive: instructor.isActive,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setDeleteDialogOpen(true);
  };

  const handleCreate = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        type: 'error',
      });
      return;
    }

    try {
      await createInstructor({
        data: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || null,
          firstName: formData.firstName || null,
          lastName: formData.lastName || null,
          roleType: 'GIANGVIEN',
          isActive: formData.isActive,
        },
      });

      toast({
        title: 'Thành công',
        description: 'Đã thêm giảng viên mới',
        type: 'success',
      });

      setCreateDialogOpen(false);
      resetForm();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể thêm giảng viên',
        type: 'error',
      });
    }
  };

  const handleUpdate = async () => {
    if (!selectedInstructor) return;

    try {
      const updateData: any = {
        username: formData.username,
        email: formData.email || null,
        phone: formData.phone || null,
        firstName: formData.firstName || null,
        lastName: formData.lastName || null,
        isActive: formData.isActive,
      };

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      await updateInstructor({
        where: { id: selectedInstructor.id },
        data: updateData,
      });

      toast({
        title: 'Thành công',
        description: 'Đã cập nhật thông tin giảng viên',
        type: 'success',
      });

      setEditDialogOpen(false);
      setSelectedInstructor(null);
      resetForm();
      refetch();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật giảng viên',
        type: 'error',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedInstructor) return;

    try {
      await deleteInstructor({
        where: { id: selectedInstructor.id },
      });

      toast({
        title: 'Thành công',
        description: 'Đã xóa giảng viên',
        type: 'success',
      });

      setDeleteDialogOpen(false);
      setSelectedInstructor(null);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa giảng viên',
        type: 'error',
      });
    }
  };

  const getFullName = (instructor: Instructor) => {
    if (instructor.firstName && instructor.lastName) {
      return `${instructor.firstName} ${instructor.lastName}`;
    }
    return instructor.username;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản lý giảng viên</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Tổng cộng {instructors.length} giảng viên</p>
        </div>
        <Button onClick={handleCreateClick} className="gap-2">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Thêm giảng viên</span>
          <span className="sm:hidden">Thêm mới</span>
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
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Lỗi: {error.message}</p>
          </CardContent>
        </Card>
      ) : filteredInstructors.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy giảng viên nào</p>
            <Button onClick={handleCreateClick} className="mt-4 gap-2">
              <Plus className="w-4 h-4" />
              Thêm giảng viên đầu tiên
            </Button>
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
                        {getFullName(instructor)}
                        {instructor.isActive ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        <Badge variant="outline" className="mr-2">GIẢNG VIÊN</Badge>
                        <span className="text-xs">@{instructor.username}</span>
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
                  {instructor.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{instructor.email}</span>
                    </div>
                  )}
                  {instructor.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{instructor.phone}</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-xl font-bold">{instructor._count?.coursesInstructed || 0}</p>
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
                {instructor.coursesInstructed && instructor.coursesInstructed.length > 0 && (
                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Khóa học đang dạy:</p>
                    <div className="space-y-1">
                      {instructor.coursesInstructed.slice(0, 3).map((course: any) => (
                        <div key={course.id} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 truncate flex-1">{course.title}</span>
                          <Badge variant={course.status === 'PUBLISHED' ? 'default' : 'secondary'} className="ml-2 text-xs">
                            {course.status === 'PUBLISHED' ? 'Public' : 'Draft'}
                          </Badge>
                        </div>
                      ))}
                      {instructor.coursesInstructed.length > 3 && (
                        <p className="text-xs text-gray-500">+{instructor.coursesInstructed.length - 3} khóa khác</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-2"
                    onClick={() => handleEditClick(instructor)}
                  >
                    <Edit className="w-4 h-4" />
                    Sửa
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Khóa học
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteClick(instructor)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Thêm giảng viên mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin giảng viên. Các trường có dấu (*) là bắt buộc.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1">
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên đăng nhập *</Label>
                  <Input
                    id="username"
                    placeholder="Nhập tên đăng nhập"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">Họ</Label>
                  <Input
                    id="firstName"
                    placeholder="Nhập họ"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Tên</Label>
                  <Input
                    id="lastName"
                    placeholder="Nhập tên"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="isActive">Kích hoạt tài khoản</Label>
                  <p className="text-sm text-gray-500">
                    Cho phép giảng viên đăng nhập và sử dụng hệ thống
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false);
                resetForm();
              }}
              disabled={createLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {createLoading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa giảng viên</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin giảng viên. Để trống mật khẩu nếu không muốn thay đổi.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-1">
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Tên đăng nhập *</Label>
                  <Input
                    id="edit-username"
                    placeholder="Nhập tên đăng nhập"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="Nhập email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-password">Mật khẩu mới</Label>
                  <Input
                    id="edit-password"
                    type="password"
                    placeholder="Để trống nếu không đổi"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Số điện thoại</Label>
                  <Input
                    id="edit-phone"
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-firstName">Họ</Label>
                  <Input
                    id="edit-firstName"
                    placeholder="Nhập họ"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-lastName">Tên</Label>
                  <Input
                    id="edit-lastName"
                    placeholder="Nhập tên"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between space-x-2 p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-isActive">Kích hoạt tài khoản</Label>
                  <p className="text-sm text-gray-500">
                    Cho phép giảng viên đăng nhập và sử dụng hệ thống
                  </p>
                </div>
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setSelectedInstructor(null);
                resetForm();
              }}
              disabled={updateLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Hủy
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateLoading}
            >
              <Save className="w-4 h-4 mr-2" />
              {updateLoading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa giảng viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa giảng viên{' '}
              <span className="font-semibold">
                {selectedInstructor ? getFullName(selectedInstructor) : ''}
              </span>
              ? Hành động này không thể hoàn tác.
              {selectedInstructor && selectedInstructor._count?.coursesInstructed > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  Giảng viên này đang dạy {selectedInstructor._count.coursesInstructed} khóa học!
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
