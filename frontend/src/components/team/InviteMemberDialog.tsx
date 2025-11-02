'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, UserPlus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string, role: string, projectId?: string) => Promise<void>;
  loading?: boolean;
  projects?: Array<{ id: string; name: string }>;
  selectedProjectId?: string | null;
  onProjectChange?: (projectId: string) => void;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  onInvite,
  loading = false,
  projects,
  selectedProjectId,
  onProjectChange,
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [localProjectId, setLocalProjectId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Sync local project id with prop
  React.useEffect(() => {
    if (selectedProjectId) {
      setLocalProjectId(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !role) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập email và chọn vai trò',
        type: 'error',
        variant: 'destructive',
      });
      return;
    }

    // Validate project selection if projects list is provided
    if (projects && projects.length > 0 && !localProjectId) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng chọn dự án',
        type: 'error',
        variant: 'destructive',
      });
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Lỗi',
        description: 'Email không hợp lệ',
        type: 'error',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      await onInvite(email, role, localProjectId || undefined);
      
      // Reset form on success
      setEmail('');
      setRole('MEMBER');
      // Don't reset project selection
      
    } catch (error) {
      // Error handled by parent component
      console.error('[InviteMemberDialog] Error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEmail('');
    setRole('MEMBER');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Mời thành viên
          </DialogTitle>
          <DialogDescription>
            Nhập email và chọn vai trò cho thành viên mới
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {/* Project selection - only show if projects prop is provided */}
            {projects && projects.length > 0 && (
              <div className="grid gap-2">
                <Label htmlFor="project">Dự án</Label>
                <Select
                  value={localProjectId}
                  onValueChange={(value) => {
                    setLocalProjectId(value);
                    onProjectChange?.(value);
                  }}
                  disabled={submitting || loading}
                >
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Chọn dự án" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="member@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  disabled={submitting || loading}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select
                value={role}
                onValueChange={setRole}
                disabled={submitting || loading}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OWNER">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Owner</span>
                      <span className="text-xs text-muted-foreground">- Toàn quyền</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ADMIN">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Admin</span>
                      <span className="text-xs text-muted-foreground">- Quản lý dự án</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="MEMBER">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Member</span>
                      <span className="text-xs text-muted-foreground">- Thành viên</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <p>💡 Người dùng phải đã có tài khoản trong hệ thống</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={submitting || loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={submitting || loading}>
              {(submitting || loading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Gửi lời mời
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
