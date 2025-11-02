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
  onInvite: (email: string, role: string) => Promise<void>;
  loading?: boolean;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  onInvite,
  loading = false,
}: InviteMemberDialogProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !role) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập email và chọn vai trò',
        type: 'error',
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
      });
      return;
    }

    setSubmitting(true);
    try {
      await onInvite(email, role);
      
      // Reset form on success
      setEmail('');
      setRole('MEMBER');
      onOpenChange(false);
      
      toast({
        title: 'Thành công',
        description: `Đã gửi lời mời đến ${email}`,
        type: 'success',
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: error instanceof Error ? error.message : 'Không thể gửi lời mời',
        type: 'error',
      });
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
          <div className="grid gap-4 py-4">
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
              <p>💡 Thành viên sẽ nhận email mời tham gia dự án</p>
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
