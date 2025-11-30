'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { toast } from 'sonner';
import {
  Bell,
  Grid3X3,
  User,
  MessageCircle,
  Zap,
  Search,
  ShoppingCart,
  Settings,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Eye,
  Copy,
  Check,
  ChevronRight,
  Shield,
  Users,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

import {
  IconType,
  IconPosition,
  IconPermissionItem,
  IconPermissionConfig,
  RoleIconPermission,
  CONFIGURABLE_ICONS,
  DEFAULT_ICON_PERMISSIONS,
  GUEST_ICON_PERMISSIONS,
  ROLE_ICON_PRESETS,
} from '@/types/icon-permission';
import { HeaderActions } from '@/components/layout/HeaderActions';

// Storage key
const STORAGE_KEY = 'icon_permissions_config';

// Icon map
const ICON_MAP: Record<IconType, LucideIcon> = {
  notifications: Bell,
  apps: Grid3X3,
  chat: MessageCircle,
  quickActions: Zap,
  user: User,
  search: Search,
  cart: ShoppingCart,
  settings: Settings,
};

// Position labels
const POSITION_LABELS: Record<IconPosition, string> = {
  external: 'Bên ngoài',
  dropdown: 'Trong dropdown',
  both: 'Cả hai',
  none: 'Ẩn',
};

// Role preset icons
const ROLE_ICONS: Record<string, { icon: LucideIcon; color: string }> = {
  ADMIN: { icon: Shield, color: 'text-red-500' },
  giangvien: { icon: GraduationCap, color: 'text-purple-500' },
  USER: { icon: User, color: 'text-blue-500' },
  content_manager: { icon: Users, color: 'text-green-500' },
};

export default function IconPermissionSettingsPage() {
  const router = useRouter();
  const [config, setConfig] = useState<IconPermissionConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Selected role for editing
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<RoleIconPermission | null>(null);
  
  // Dialog states
  const [showAddRole, setShowAddRole] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewVariant, setPreviewVariant] = useState<'light' | 'dark'>('light');
  
  // New role form
  const [newRoleId, setNewRoleId] = useState('');
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDisplayName, setNewRoleDisplayName] = useState('');

  // Load config
  useEffect(() => {
    const loadConfig = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setConfig(JSON.parse(stored));
        } else {
          // Default config
          const defaultConfig: IconPermissionConfig = {
            roles: [
              { roleId: 'admin', roleName: 'ADMIN', roleDisplayName: 'Quản trị viên', icons: ROLE_ICON_PRESETS.ADMIN },
              { roleId: 'giangvien', roleName: 'giangvien', roleDisplayName: 'Giảng viên', icons: ROLE_ICON_PRESETS.giangvien },
              { roleId: 'user', roleName: 'USER', roleDisplayName: 'Người dùng', icons: ROLE_ICON_PRESETS.USER },
            ],
            defaults: DEFAULT_ICON_PERMISSIONS,
            guestConfig: GUEST_ICON_PERMISSIONS,
          };
          setConfig(defaultConfig);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
        }
      } catch (err) {
        toast.error('Không thể tải cấu hình');
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  // Save config
  const handleSave = async () => {
    if (!config) return;
    
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      setHasChanges(false);
      toast.success('Đã lưu cấu hình thành công');
    } catch (err) {
      toast.error('Không thể lưu cấu hình');
    } finally {
      setSaving(false);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    const defaultConfig: IconPermissionConfig = {
      roles: [
        { roleId: 'admin', roleName: 'ADMIN', roleDisplayName: 'Quản trị viên', icons: ROLE_ICON_PRESETS.ADMIN },
        { roleId: 'giangvien', roleName: 'giangvien', roleDisplayName: 'Giảng viên', icons: ROLE_ICON_PRESETS.giangvien },
        { roleId: 'user', roleName: 'USER', roleDisplayName: 'Người dùng', icons: ROLE_ICON_PRESETS.USER },
      ],
      defaults: DEFAULT_ICON_PERMISSIONS,
      guestConfig: GUEST_ICON_PERMISSIONS,
    };
    setConfig(defaultConfig);
    setHasChanges(true);
    setShowResetConfirm(false);
    toast.success('Đã khôi phục cấu hình mặc định');
  };

  // Add new role
  const handleAddRole = () => {
    if (!config || !newRoleId.trim() || !newRoleName.trim()) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (config.roles.some(r => r.roleId === newRoleId)) {
      toast.error('Role ID đã tồn tại');
      return;
    }

    const newRole: RoleIconPermission = {
      roleId: newRoleId.trim().toLowerCase(),
      roleName: newRoleName.trim(),
      roleDisplayName: newRoleDisplayName.trim() || newRoleName.trim(),
      icons: [...DEFAULT_ICON_PERMISSIONS],
      updatedAt: new Date(),
    };

    setConfig({
      ...config,
      roles: [...config.roles, newRole],
    });
    setHasChanges(true);
    setShowAddRole(false);
    setNewRoleId('');
    setNewRoleName('');
    setNewRoleDisplayName('');
    toast.success('Đã thêm role mới');
  };

  // Delete role
  const handleDeleteRole = (roleId: string) => {
    if (!config) return;

    setConfig({
      ...config,
      roles: config.roles.filter(r => r.roleId !== roleId),
    });
    setHasChanges(true);
    setShowDeleteConfirm(null);
    if (selectedRoleId === roleId) {
      setSelectedRoleId(null);
      setEditingRole(null);
    }
    toast.success('Đã xóa role');
  };

  // Select role for editing
  const handleSelectRole = (roleId: string) => {
    if (!config) return;
    const role = config.roles.find(r => r.roleId === roleId);
    if (role) {
      setSelectedRoleId(roleId);
      setEditingRole({ ...role, icons: [...role.icons] });
    }
  };

  // Update icon permission
  const handleUpdateIcon = (iconType: IconType, field: 'position' | 'enabled', value: any) => {
    if (!editingRole) return;

    const newIcons = editingRole.icons.map(icon => {
      if (icon.iconType === iconType) {
        return { ...icon, [field]: value };
      }
      return icon;
    });

    // Ensure all icons exist
    CONFIGURABLE_ICONS.forEach(configIcon => {
      if (!newIcons.find(i => i.iconType === configIcon.id)) {
        newIcons.push({
          iconType: configIcon.id,
          position: configIcon.defaultPosition,
          enabled: configIcon.defaultEnabled,
        });
      }
    });

    setEditingRole({ ...editingRole, icons: newIcons });
  };

  // Save role changes
  const handleSaveRoleChanges = () => {
    if (!config || !editingRole || !selectedRoleId) return;

    const updatedRole = { ...editingRole, updatedAt: new Date() };
    const newRoles = config.roles.map(r =>
      r.roleId === selectedRoleId ? updatedRole : r
    );

    setConfig({ ...config, roles: newRoles });
    setHasChanges(true);
    toast.success('Đã cập nhật cấu hình role');
  };

  // Apply preset to role
  const handleApplyPreset = (preset: string) => {
    if (!editingRole) return;
    
    const presetIcons = ROLE_ICON_PRESETS[preset];
    if (presetIcons) {
      setEditingRole({ ...editingRole, icons: [...presetIcons] });
      toast.success(`Đã áp dụng preset "${preset}"`);
    }
  };

  // Get icon permission for current editing role
  const getIconPerm = (iconType: IconType): IconPermissionItem | undefined => {
    return editingRole?.icons.find(i => i.iconType === iconType);
  };

  // Generate preview config
  const getPreviewConfig = () => {
    if (!editingRole) return null;

    const checkPermission = (iconType: IconType, position: 'external' | 'dropdown') => {
      const perm = editingRole.icons.find(i => i.iconType === iconType);
      if (!perm || !perm.enabled) return false;
      return perm.position === position || perm.position === 'both';
    };

    const isEnabled = (iconType: IconType) => {
      const perm = editingRole.icons.find(i => i.iconType === iconType);
      return perm?.enabled ?? false;
    };

    return {
      showNotifications: checkPermission('notifications', 'external'),
      showApps: checkPermission('apps', 'external'),
      showChat: checkPermission('chat', 'external'),
      showUser: isEnabled('user'),
      userConfig: {
        showNotifications: checkPermission('notifications', 'dropdown'),
        showApps: checkPermission('apps', 'dropdown'),
        showChat: checkPermission('chat', 'dropdown'),
        showQuickActions: isEnabled('quickActions'),
      },
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Phân quyền Icon Header</h1>
          <p className="text-muted-foreground">
            Cấu hình hiển thị icon theo từng nhóm quyền
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowResetConfirm(true)}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Khôi phục mặc định
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>

      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
          ⚠️ Bạn có thay đổi chưa lưu. Nhấn "Lưu thay đổi" để áp dụng.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Danh sách Role
            </CardTitle>
            <CardDescription>
              Chọn role để cấu hình quyền hiển thị icon
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="p-4 space-y-2">
                {config?.roles.map((role) => {
                  const roleIcon = ROLE_ICONS[role.roleName] || { icon: User, color: 'text-gray-500' };
                  const Icon = roleIcon.icon;
                  const isSelected = selectedRoleId === role.roleId;
                  
                  return (
                    <div
                      key={role.roleId}
                      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSelectRole(role.roleId)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${roleIcon.color}`} />
                        <div>
                          <p className="font-medium">{role.roleDisplayName || role.roleName}</p>
                          <p className="text-xs text-muted-foreground">{role.roleName}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {role.icons.filter(i => i.enabled).length} icons
                        </Badge>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAddRole(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm Role mới
            </Button>
          </CardFooter>
        </Card>

        {/* Icon Configuration */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {editingRole 
                    ? `Cấu hình: ${editingRole.roleDisplayName || editingRole.roleName}`
                    : 'Cấu hình Icon'
                  }
                </CardTitle>
                <CardDescription>
                  {editingRole 
                    ? 'Thiết lập vị trí hiển thị cho từng icon'
                    : 'Chọn role từ danh sách bên trái để bắt đầu'
                  }
                </CardDescription>
              </div>
              {editingRole && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(true)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Xem trước
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(selectedRoleId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {editingRole ? (
              <div className="space-y-6">
                {/* Preset selector */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Label className="shrink-0">Áp dụng Preset:</Label>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(ROLE_ICON_PRESETS).map((preset) => (
                      <Button
                        key={preset}
                        variant="outline"
                        size="sm"
                        onClick={() => handleApplyPreset(preset)}
                      >
                        {preset}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Icon list */}
                <div className="space-y-4">
                  {CONFIGURABLE_ICONS.map((iconConfig) => {
                    const IconComp = ICON_MAP[iconConfig.id];
                    const perm = getIconPerm(iconConfig.id);
                    const isEnabled = perm?.enabled ?? iconConfig.defaultEnabled;
                    const position = perm?.position ?? iconConfig.defaultPosition;

                    return (
                      <div
                        key={iconConfig.id}
                        className={`p-4 rounded-lg border transition-opacity ${
                          isEnabled ? 'bg-white' : 'bg-gray-50 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              isEnabled ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                            }`}>
                              <IconComp className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{iconConfig.name}</p>
                              <p className="text-sm text-muted-foreground">{iconConfig.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            {/* Position selector */}
                            <Select
                              value={position}
                              onValueChange={(value) => handleUpdateIcon(iconConfig.id, 'position', value)}
                              disabled={!isEnabled}
                            >
                              <SelectTrigger className="w-[140px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="external">Bên ngoài</SelectItem>
                                <SelectItem value="dropdown">Trong dropdown</SelectItem>
                                <SelectItem value="both">Cả hai</SelectItem>
                                <SelectItem value="none">Ẩn</SelectItem>
                              </SelectContent>
                            </Select>

                            {/* Enable switch */}
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={isEnabled}
                                onCheckedChange={(checked) => handleUpdateIcon(iconConfig.id, 'enabled', checked)}
                              />
                              <Label className="text-sm w-12">
                                {isEnabled ? 'Bật' : 'Tắt'}
                              </Label>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Save button */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (selectedRoleId && config) {
                        const original = config.roles.find(r => r.roleId === selectedRoleId);
                        if (original) {
                          setEditingRole({ ...original, icons: [...original.icons] });
                        }
                      }
                    }}
                  >
                    Hủy thay đổi
                  </Button>
                  <Button onClick={handleSaveRoleChanges}>
                    <Check className="h-4 w-4 mr-2" />
                    Áp dụng cho Role này
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Settings className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">Chọn một role từ danh sách bên trái</p>
                <p className="text-sm text-gray-400">để bắt đầu cấu hình quyền hiển thị icon</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Guest & Default Config */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cấu hình mặc định</CardTitle>
          <CardDescription>
            Cấu hình cho khách (chưa đăng nhập) và role không được định nghĩa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="guest">
            <TabsList>
              <TabsTrigger value="guest">Khách (Guest)</TabsTrigger>
              <TabsTrigger value="defaults">Role mặc định</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guest" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {config?.guestConfig.map((perm) => {
                  const iconConfig = CONFIGURABLE_ICONS.find(i => i.id === perm.iconType);
                  if (!iconConfig) return null;
                  const Icon = ICON_MAP[perm.iconType];
                  
                  return (
                    <div key={perm.iconType} className="p-3 rounded-lg border bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium text-sm">{iconConfig.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {perm.enabled ? POSITION_LABELS[perm.position] : 'Ẩn'}
                        </span>
                        <Badge variant={perm.enabled ? 'default' : 'secondary'} className="text-[10px]">
                          {perm.enabled ? 'Bật' : 'Tắt'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="defaults" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {config?.defaults.map((perm) => {
                  const iconConfig = CONFIGURABLE_ICONS.find(i => i.id === perm.iconType);
                  if (!iconConfig) return null;
                  const Icon = ICON_MAP[perm.iconType];
                  
                  return (
                    <div key={perm.iconType} className="p-3 rounded-lg border bg-gray-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="h-4 w-4" />
                        <span className="font-medium text-sm">{iconConfig.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          {perm.enabled ? POSITION_LABELS[perm.position] : 'Ẩn'}
                        </span>
                        <Badge variant={perm.enabled ? 'default' : 'secondary'} className="text-[10px]">
                          {perm.enabled ? 'Bật' : 'Tắt'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add Role Dialog */}
      <Dialog open={showAddRole} onOpenChange={setShowAddRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm Role mới</DialogTitle>
            <DialogDescription>
              Tạo cấu hình icon cho một role mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="roleId">Role ID *</Label>
              <Input
                id="roleId"
                placeholder="vd: content_editor"
                value={newRoleId}
                onChange={(e) => setNewRoleId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                ID duy nhất, viết thường, không dấu
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name *</Label>
              <Input
                id="roleName"
                placeholder="vd: content_editor"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Tên role trong hệ thống RBAC
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Tên hiển thị</Label>
              <Input
                id="displayName"
                placeholder="vd: Biên tập viên nội dung"
                value={newRoleDisplayName}
                onChange={(e) => setNewRoleDisplayName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddRole(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddRole}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <AlertDialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa Role</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa cấu hình của role này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => showDeleteConfirm && handleDeleteRole(showDeleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Confirm Dialog */}
      <AlertDialog open={showResetConfirm} onOpenChange={setShowResetConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Khôi phục cấu hình mặc định</AlertDialogTitle>
            <AlertDialogDescription>
              Tất cả cấu hình hiện tại sẽ bị xóa và thay thế bằng cấu hình mặc định. Bạn có chắc chắn?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>
              Khôi phục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Xem trước Header Actions</DialogTitle>
            <DialogDescription>
              Xem trước giao diện với cấu hình của role: {editingRole?.roleDisplayName || editingRole?.roleName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Variant toggle */}
            <div className="flex items-center gap-4">
              <Label>Theme:</Label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={previewVariant === 'light' ? 'default' : 'outline'}
                  onClick={() => setPreviewVariant('light')}
                >
                  Light
                </Button>
                <Button
                  size="sm"
                  variant={previewVariant === 'dark' ? 'default' : 'outline'}
                  onClick={() => setPreviewVariant('dark')}
                >
                  Dark
                </Button>
              </div>
            </div>

            {/* Preview area */}
            <div className={`p-6 rounded-lg border ${previewVariant === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
              <div className="flex justify-end">
                {getPreviewConfig() && (
                  <HeaderActions
                    variant={previewVariant}
                    {...getPreviewConfig()!}
                  />
                )}
              </div>
            </div>

            {/* Config summary */}
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              <p className="font-medium mb-2">Cấu hình:</p>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(getPreviewConfig(), null, 2)}
              </pre>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPreview(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
