'use client';

import React, { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  useDeleteProject,
  usePermanentlyDeleteProject,
  useRestoreProject,
  useUpdateProject,
} from '@/hooks/useProjects.dynamic';
import {
  MoreVertical,
  Archive,
  ArchiveRestore,
  Trash2,
  AlertTriangle,
  Loader2,
  Edit,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectActionsMenuProps {
  project: {
    id: string;
    name: string;
    description?: string;
    avatar?: string;
    isArchived?: boolean;
  };
  onDelete?: () => void;
  onUpdate?: () => void;
  className?: string;
}

// Backward compatible export
export function DeleteProjectMenu(props: ProjectActionsMenuProps) {
  return <ProjectActionsMenu {...props} />;
}

export function ProjectActionsMenu({
  project,
  onDelete,
  onUpdate,
  className,
}: ProjectActionsMenuProps) {
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    name: project.name,
    description: project.description || '',
  });

  // Reset form when project changes
  useEffect(() => {
    setEditForm({
      name: project.name,
      description: project.description || '',
    });
  }, [project.name, project.description]);

  const [deleteProject, { loading: archiving }] = useDeleteProject();
  const [permanentlyDelete, { loading: deleting }] = usePermanentlyDeleteProject();
  const [restoreProject, { loading: restoring }] = useRestoreProject();
  const [updateProject, { loading: updating }] = useUpdateProject();

  // Handle Edit
  const handleEdit = async () => {
    if (!editForm.name.trim()) {
      toast({
        title: '⚠️ Lỗi',
        description: 'Tên dự án không được để trống',
        type: 'error',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateProject({
        variables: {
          id: project.id,
          input: {
            name: editForm.name.trim(),
            description: editForm.description.trim() || undefined,
          },
        },
      });

      toast({
        title: '✅ Đã cập nhật',
        description: `Dự án "${editForm.name}" đã được cập nhật`,
        type: 'success',
      });

      setShowEditDialog(false);
      onUpdate?.();
    } catch (error: any) {
      toast({
        title: '❌ Lỗi',
        description: error.message || 'Không thể cập nhật dự án',
        type: 'error',
        variant: 'destructive',
      });
    }
  };

  const handleArchive = async () => {
    try {
      await deleteProject({
        variables: { id: project.id },
      });

      toast({
        title: '✅ Đã lưu trữ',
        description: `Dự án "${project.name}" đã được lưu trữ`,
        type: 'success',
      });

      setShowArchiveDialog(false);
      onDelete?.();
    } catch (error: any) {
      toast({
        title: '❌ Lỗi',
        description: error.message || 'Không thể lưu trữ dự án',
        type: 'error',
        variant: 'destructive',
      });
    }
  };

  const handlePermanentDelete = async () => {
    if (confirmText !== project.name) {
      toast({
        title: '⚠️ Xác nhận không đúng',
        description: 'Vui lòng nhập chính xác tên dự án',
        type: 'error',
        variant: 'destructive',
      });
      return;
    }

    try {
      await permanentlyDelete({
        variables: { id: project.id },
      });

      toast({
        title: '✅ Đã xóa vĩnh viễn',
        description: `Dự án "${project.name}" và tất cả dữ liệu đã bị xóa`,
        type: 'success',
      });

      setShowDeleteDialog(false);
      setConfirmText('');
      onDelete?.();
    } catch (error: any) {
      toast({
        title: '❌ Lỗi',
        description: error.message || 'Không thể xóa dự án',
        type: 'error',
        variant: 'destructive',
      });
    }
  };

  const handleRestore = async () => {
    try {
      await restoreProject({
        variables: { id: project.id },
      });

      toast({
        title: '✅ Đã khôi phục',
        description: `Dự án "${project.name}" đã được khôi phục`,
        type: 'success',
      });

      setShowRestoreDialog(false);
      onDelete?.();
    } catch (error: any) {
      toast({
        title: '❌ Lỗi',
        description: error.message || 'Không thể khôi phục dự án',
        type: 'error',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', className)}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Edit Option - Always available */}
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa dự án
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
          {!project.isArchived ? (
            <>
              <DropdownMenuItem onClick={() => setShowArchiveDialog(true)}>
                <Archive className="mr-2 h-4 w-4" />
                Lưu trữ dự án
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa vĩnh viễn
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => setShowRestoreDialog(true)}>
                <ArchiveRestore className="mr-2 h-4 w-4" />
                Khôi phục dự án
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa vĩnh viễn
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent 
          className="max-w-[95vw] sm:max-w-[450px] max-h-[90vh] flex flex-col p-0"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fixed Header */}
          <DialogHeader className="px-4 pt-4 sm:px-6 sm:pt-6 pb-2 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Chỉnh sửa dự án
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin dự án của bạn
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tên dự án *</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Nhập tên dự án..."
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Mô tả ngắn về dự án..."
                rows={3}
                className="w-full resize-none"
              />
            </div>
          </div>

          {/* Fixed Footer */}
          <DialogFooter className="px-4 pb-4 sm:px-6 sm:pb-6 pt-2 border-t shrink-0 gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setShowEditDialog(false)}
              disabled={updating}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button 
              onClick={handleEdit} 
              disabled={updating || !editForm.name.trim()}
              className="w-full sm:w-auto"
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Lưu trữ dự án?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Dự án <span className="font-semibold">&quot;{project.name}&quot;</span> sẽ được lưu trữ.
              </p>
              <p className="text-sm">
                ✅ Dữ liệu được giữ nguyên
                <br />
                ✅ Có thể khôi phục bất kỳ lúc nào
                <br />
                ⚠️ Dự án sẽ bị ẩn khỏi danh sách
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={archiving}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleArchive();
              }}
              disabled={archiving}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {archiving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Archive className="mr-2 h-4 w-4" />
                  Lưu trữ
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Dialog */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ArchiveRestore className="h-5 w-5" />
              Khôi phục dự án?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Dự án <span className="font-semibold">&quot;{project.name}&quot;</span> sẽ được khôi phục và hiển thị trở lại trong danh sách.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={restoring}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleRestore();
              }}
              disabled={restoring}
              className="bg-green-600 hover:bg-green-700"
            >
              {restoring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang khôi phục...
                </>
              ) : (
                <>
                  <ArchiveRestore className="mr-2 h-4 w-4" />
                  Khôi phục
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Xóa vĩnh viễn dự án?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <div className="space-y-2">
                <p className="font-semibold text-destructive">
                  ⚠️ CẢNH BÁO: Hành động này KHÔNG THỂ KHÔI PHỤC!
                </p>
                <p>
                  Dự án <span className="font-semibold">&quot;{project.name}&quot;</span> cùng TẤT CẢ dữ liệu liên quan sẽ bị xóa vĩnh viễn:
                </p>
                <ul className="text-sm space-y-1 ml-4">
                  <li>❌ Tất cả tasks</li>
                  <li>❌ Tất cả tin nhắn chat</li>
                  <li>❌ Tất cả thành viên</li>
                  <li>❌ Tất cả file đính kèm</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="confirm-delete" className="text-sm font-medium">
                  Nhập <span className="font-mono bg-muted px-1 rounded">{project.name}</span> để xác nhận:
                </Label>
                <Input
                  id="confirm-delete"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Nhập tên dự án"
                  className="font-mono"
                  autoComplete="off"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              onClick={() => setConfirmText('')}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handlePermanentDelete();
              }}
              disabled={deleting || confirmText !== project.name}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa vĩnh viễn
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
