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
import { Mail, UserPlus, Loader2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useApolloClient, gql } from '@apollo/client';

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
  const [emailError, setEmailError] = useState<string>('');
  const [validatedUserId, setValidatedUserId] = useState<string | null>(null);
  const [validatedUserName, setValidatedUserName] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);
  const [existingRole, setExistingRole] = useState<string | null>(null);
  const [checkingMembership, setCheckingMembership] = useState(false);
  const { toast } = useToast();
  const apolloClient = useApolloClient();

  // Sync local project id with prop
  React.useEffect(() => {
    if (selectedProjectId) {
      setLocalProjectId(selectedProjectId);
    }
  }, [selectedProjectId]);

  // Reset validated user when email changes
  React.useEffect(() => {
    setValidatedUserId(null);
    setValidatedUserName('');
    setExistingRole(null);
  }, [email]);

  // Validate email on change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear error if empty
    if (!value.trim()) {
      setEmailError('');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      setEmailError('Email không hợp lệ');
    } else {
      setEmailError('');
    }
  };

  // Check if form is valid
  const isFormValid = React.useMemo(() => {
    // Email must be valid
    if (!email.trim() || emailError) return false;
    
    // User must be validated
    if (!validatedUserId) return false;
    
    // Role must be selected
    if (!role) return false;
    
    // Project must be selected if projects list exists
    if (projects && projects.length > 0 && !localProjectId) return false;
    
    return true;
  }, [email, emailError, validatedUserId, role, projects, localProjectId]);

  // Validate user exists in database
  const handleValidateUser = async () => {
    if (!email.trim()) {
      toast({
        title: '⚠️ Email trống',
        description: 'Vui lòng nhập email trước khi kiểm tra',
        type: 'error',
        variant: 'destructive',
      });
      return;
    }

    if (emailError) {
      toast({
        title: '⚠️ Email không hợp lệ',
        description: 'Vui lòng nhập đúng định dạng email',
        type: 'error',
        variant: 'destructive',
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Step 1: Find user by email
      const { data: userData } = await apolloClient.query({
        query: gql`
          query FindUserByEmail($input: UnifiedFindManyInput, $modelName: String!) {
            findMany(modelName: $modelName, input: $input)
          }
        `,
        variables: {
          modelName: 'user',
          input: {
            where: {
              email: {
                equals: email.trim().toLowerCase(),
              },
            },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        fetchPolicy: 'network-only',
      });

      // Parse response
      let users = userData?.findMany;
      if (typeof users === 'string') {
        try {
          users = JSON.parse(users);
        } catch (parseError) {
          console.error('[InviteMemberDialog] JSON parse error:', parseError);
          toast({
            title: '❌ Lỗi dữ liệu',
            description: 'Không thể xử lý dữ liệu từ server',
            type: 'error',
            variant: 'destructive',
          });
          return;
        }
      }

      // Validate user exists
      if (!users || !Array.isArray(users) || users.length === 0) {
        toast({
          title: '❌ Người dùng không tồn tại',
          description: `Email "${email}" chưa được đăng ký trong hệ thống. Vui lòng mời người dùng đăng ký trước.`,
          type: 'warning',
          variant: 'destructive',
        });
        setValidatedUserId(null);
        setValidatedUserName('');
        setExistingRole(null);
        return;
      }

      const user = users[0];
      
      // Validate user ID
      if (!user?.id || typeof user.id !== 'string' || user.id.trim() === '') {
        toast({
          title: '❌ Lỗi dữ liệu người dùng',
          description: 'ID người dùng không hợp lệ',
          type: 'error',
          variant: 'destructive',
        });
        setValidatedUserId(null);
        setValidatedUserName('');
        setExistingRole(null);
        return;
      }

      const userName = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'Không có tên';
      const userId = user.id.trim();
      
      setValidatedUserId(userId);
      setValidatedUserName(userName);

      // Step 2: Check if user is already a member of the project
      const targetProjectId = localProjectId || selectedProjectId;
      if (targetProjectId) {
        setCheckingMembership(true);
        
        try {
          const { data: memberData } = await apolloClient.query({
            query: gql`
              query CheckProjectMembership($input: UnifiedFindManyInput, $modelName: String!) {
                findMany(modelName: $modelName, input: $input)
              }
            `,
            variables: {
              modelName: 'projectMember',
              input: {
                where: {
                  AND: [
                    { projectId: { equals: targetProjectId } },
                    { userId: { equals: userId } }
                  ]
                },
                select: {
                  id: true,
                  role: true,
                },
              },
            },
            fetchPolicy: 'network-only',
          });

          let members = memberData?.findMany;
          if (typeof members === 'string') {
            try {
              members = JSON.parse(members);
            } catch (parseError) {
              console.error('[InviteMemberDialog] Member parse error:', parseError);
            }
          }

          if (members && Array.isArray(members) && members.length > 0) {
            const member = members[0];
            const currentRole = member.role || 'MEMBER';
            setExistingRole(currentRole);
            
            toast({
              title: '⚠️ Người dùng đã là thành viên',
              description: `${userName} đã tham gia dự án với vai trò ${getRoleDisplayName(currentRole)}. Bạn có thể thay đổi vai trò.`,
              type: 'warning',
              variant: 'default',
            });
          } else {
            setExistingRole(null);
            toast({
              title: '✅ Tìm thấy người dùng',
              description: `${userName} (${user.email}) chưa tham gia dự án này.`,
              type: 'success',
              variant: 'default',
            });
          }
        } catch (memberError) {
          console.error('[InviteMemberDialog] Check membership error:', memberError);
          setExistingRole(null);
          toast({
            title: '✅ Tìm thấy người dùng',
            description: `${userName} (${user.email})`,
            type: 'success',
            variant: 'default',
          });
        } finally {
          setCheckingMembership(false);
        }
      } else {
        setExistingRole(null);
        toast({
          title: '✅ Tìm thấy người dùng',
          description: `${userName} (${user.email})`,
          type: 'success',
          variant: 'default',
        });
      }

    } catch (error) {
      console.error('[InviteMemberDialog] Validate user error:', error);
      toast({
        title: '❌ Lỗi kiểm tra',
        description: error instanceof Error ? error.message : 'Không thể kiểm tra email',
        type: 'error',
        variant: 'destructive',
      });
      setValidatedUserId(null);
      setValidatedUserName('');
      setExistingRole(null);
    } finally {
      setIsValidating(false);
    }
  };

  // Helper function to get role display name
  const getRoleDisplayName = (role: string): string => {
    const roleMap: Record<string, string> = {
      'OWNER': 'Owner',
      'ADMIN': 'Admin',
      'MEMBER': 'Member',
    };
    return roleMap[role.toUpperCase()] || role;
  };

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

    // Validate user must be checked first
    if (!validatedUserId) {
      toast({
        title: '⚠️ Chưa kiểm tra người dùng',
        description: 'Vui lòng nhấn nút tìm kiếm để kiểm tra email trước',
        type: 'warning',
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

    // If user is already a member, ask for confirmation to change role
    if (existingRole) {
      const currentRoleName = getRoleDisplayName(existingRole);
      const newRoleName = getRoleDisplayName(role);
      
      if (existingRole.toUpperCase() === role.toUpperCase()) {
        toast({
          title: 'ℹ️ Vai trò giống nhau',
          description: `${validatedUserName} đã có vai trò ${currentRoleName} trong dự án này.`,
          type: 'info',
          variant: 'default',
        });
        return;
      }
      
      const confirmed = window.confirm(
        `🔄 Thay đổi vai trò\n\n` +
        `Người dùng: ${validatedUserName}\n` +
        `Vai trò hiện tại: ${currentRoleName}\n` +
        `Vai trò mới: ${newRoleName}\n\n` +
        `Bạn có chắc chắn muốn thay đổi vai trò không?`
      );
      
      if (!confirmed) {
        console.log('[InviteMemberDialog] User cancelled role change');
        return;
      }
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
      setValidatedUserId(null);
      setValidatedUserName('');
      setExistingRole(null);
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
    setValidatedUserId(null);
    setValidatedUserName('');
    setExistingRole(null);
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
          <div className="grid gap-4 p-4 max-h-[60vh] overflow-y-auto">
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
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="member@example.com"
                    value={email}
                    onChange={handleEmailChange}
                    className={`pl-9 pr-10 ${
                      email && emailError 
                        ? 'border-red-500' 
                        : email && !emailError 
                        ? 'border-green-500' 
                        : ''
                    }`}
                    disabled={submitting || loading || isValidating}
                    autoComplete="off"
                    required
                  />
                  {email && (
                    <div className="absolute right-3 top-3">
                      {emailError ? (
                        <span className="text-red-500 text-lg leading-none">✖</span>
                      ) : (
                        <span className="text-green-500 text-lg leading-none">✓</span>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleValidateUser}
                  disabled={!email || !!emailError || isValidating || submitting || loading}
                  title="Kiểm tra email"
                  className="shrink-0"
                >
                  {isValidating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {validatedUserId && validatedUserName && (
                <div className={`flex items-center gap-2 p-2 rounded-md ${
                  existingRole 
                    ? 'bg-amber-50 border border-amber-200' 
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <span className={`text-sm ${existingRole ? 'text-amber-600' : 'text-green-600'}`}>
                    {existingRole ? '⚠️' : '✓'}
                  </span>
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${existingRole ? 'text-amber-800' : 'text-green-800'}`}>
                      {validatedUserName}
                    </span>
                    {existingRole ? (
                      <span className="text-xs text-amber-600 ml-2">
                        - Vai trò hiện tại: {getRoleDisplayName(existingRole)}
                      </span>
                    ) : (
                      <span className="text-xs text-green-600 ml-2">
                        - Chưa tham gia dự án
                      </span>
                    )}
                  </div>
                  {checkingMembership && (
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                </div>
              )}
              {emailError && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <span>⚠️</span>
                  <span>{emailError}</span>
                </p>
              )}
              {!emailError && !validatedUserId && (
                <p className="text-xs text-muted-foreground">
                  💡 Nhập email và nhấn nút tìm kiếm để kiểm tra
                </p>
              )}
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

            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm">
              <div className="flex gap-2">
                <span className="text-amber-600 flex-shrink-0">⚠️</span>
                <div className="text-amber-800 space-y-1">
                  <p className="font-medium">Lưu ý quan trọng:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-xs">
                    <li>Nhấn nút <strong>tìm kiếm</strong> để kiểm tra email</li>
                    <li>Hệ thống sẽ kiểm tra người dùng có tồn tại không</li>
                    <li>Nếu đã là thành viên, bạn có thể thay đổi vai trò</li>
                    <li>Nếu chưa có tài khoản, mời người dùng đăng ký trước</li>
                  </ul>
                </div>
              </div>
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
            <Button 
              type="submit" 
              disabled={!isFormValid || submitting || loading}
            >
              {(submitting || loading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {submitting ? 'Đang xử lý...' : 'Thêm thành viên'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
