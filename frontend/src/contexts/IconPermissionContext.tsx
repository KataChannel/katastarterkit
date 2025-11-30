'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/usePermission';
import {
  IconType,
  IconPosition,
  IconPermissionItem,
  IconPermissionConfig,
  RoleIconPermission,
  DEFAULT_ICON_PERMISSIONS,
  GUEST_ICON_PERMISSIONS,
  ROLE_ICON_PRESETS,
  CONFIGURABLE_ICONS,
  mergeIconPermissions,
} from '@/types/icon-permission';

// Storage key
const STORAGE_KEY = 'icon_permissions_config';

// Context value interface
interface IconPermissionContextValue {
  // State
  config: IconPermissionConfig | null;
  loading: boolean;
  error: Error | null;
  currentPermissions: IconPermissionItem[];
  userRoles: string[];
  
  // Admin Actions
  loadConfig: () => Promise<void>;
  saveConfig: (config: IconPermissionConfig) => Promise<boolean>;
  updateRoleConfig: (roleId: string, roleName: string, icons: IconPermissionItem[], displayName?: string) => Promise<boolean>;
  deleteRoleConfig: (roleId: string) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
  applyPreset: (roleName: string, preset: keyof typeof ROLE_ICON_PRESETS) => Promise<boolean>;
  
  // Helpers
  checkIconPermission: (iconType: IconType, position: 'external' | 'dropdown') => boolean;
  getIconPosition: (iconType: IconType) => IconPosition;
  isIconEnabled: (iconType: IconType) => boolean;
  
  // Ready-to-use config for HeaderActions
  headerActionsConfig: {
    showNotifications: boolean;
    showApps: boolean;
    showChat: boolean;
    showUser: boolean;
    userConfig: {
      showNotifications: boolean;
      showApps: boolean;
      showChat: boolean;
      showQuickActions: boolean;
    };
  };
  
  // Meta
  availableIcons: typeof CONFIGURABLE_ICONS;
  availablePresets: typeof ROLE_ICON_PRESETS;
}

// Create context
const IconPermissionContext = createContext<IconPermissionContextValue | undefined>(undefined);

// Provider props
interface IconPermissionProviderProps {
  children: ReactNode;
}

// Provider component
export function IconPermissionProvider({ children }: IconPermissionProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const { hasAnyRole } = useRole();
  
  const [config, setConfig] = useState<IconPermissionConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load config
  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load từ localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as IconPermissionConfig;
        setConfig(parsed);
      } else {
        // Khởi tạo config mặc định
        const defaultConfig: IconPermissionConfig = {
          roles: [
            {
              roleId: 'admin',
              roleName: 'ADMIN',
              roleDisplayName: 'Quản trị viên',
              icons: ROLE_ICON_PRESETS.ADMIN || DEFAULT_ICON_PERMISSIONS,
            },
            {
              roleId: 'giangvien',
              roleName: 'giangvien',
              roleDisplayName: 'Giảng viên',
              icons: ROLE_ICON_PRESETS.giangvien || DEFAULT_ICON_PERMISSIONS,
            },
            {
              roleId: 'user',
              roleName: 'USER',
              roleDisplayName: 'Người dùng',
              icons: ROLE_ICON_PRESETS.USER || DEFAULT_ICON_PERMISSIONS,
            },
          ],
          defaults: DEFAULT_ICON_PERMISSIONS,
          guestConfig: GUEST_ICON_PERMISSIONS,
        };
        setConfig(defaultConfig);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Không thể tải cấu hình'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Save config
  const saveConfig = useCallback(async (newConfig: IconPermissionConfig): Promise<boolean> => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      setConfig(newConfig);
      
      // TODO: Sync với backend API nếu cần
      // await fetch('/api/settings/icon-permissions', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newConfig),
      // });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Không thể lưu cấu hình'));
      return false;
    }
  }, []);

  // Update role config
  const updateRoleConfig = useCallback(async (
    roleId: string,
    roleName: string,
    icons: IconPermissionItem[],
    displayName?: string
  ): Promise<boolean> => {
    const newConfig: IconPermissionConfig = config ? { ...config } : {
      roles: [],
      defaults: DEFAULT_ICON_PERMISSIONS,
      guestConfig: GUEST_ICON_PERMISSIONS,
    };

    const existingIndex = newConfig.roles.findIndex(r => r.roleId === roleId);
    const roleConfig: RoleIconPermission = {
      roleId,
      roleName,
      roleDisplayName: displayName || roleName,
      icons,
      updatedAt: new Date(),
    };

    if (existingIndex >= 0) {
      newConfig.roles[existingIndex] = roleConfig;
    } else {
      newConfig.roles.push(roleConfig);
    }

    return saveConfig(newConfig);
  }, [config, saveConfig]);

  // Delete role config
  const deleteRoleConfig = useCallback(async (roleId: string): Promise<boolean> => {
    if (!config) return false;
    
    const newConfig = {
      ...config,
      roles: config.roles.filter(r => r.roleId !== roleId),
    };
    
    return saveConfig(newConfig);
  }, [config, saveConfig]);

  // Reset to defaults
  const resetToDefaults = useCallback(async (): Promise<boolean> => {
    const defaultConfig: IconPermissionConfig = {
      roles: [
        {
          roleId: 'admin',
          roleName: 'ADMIN',
          roleDisplayName: 'Quản trị viên',
          icons: ROLE_ICON_PRESETS.ADMIN,
        },
        {
          roleId: 'giangvien',
          roleName: 'giangvien',
          roleDisplayName: 'Giảng viên',
          icons: ROLE_ICON_PRESETS.giangvien,
        },
        {
          roleId: 'user',
          roleName: 'USER',
          roleDisplayName: 'Người dùng',
          icons: ROLE_ICON_PRESETS.USER,
        },
      ],
      defaults: DEFAULT_ICON_PERMISSIONS,
      guestConfig: GUEST_ICON_PERMISSIONS,
    };
    
    return saveConfig(defaultConfig);
  }, [saveConfig]);

  // Apply preset to a role
  const applyPreset = useCallback(async (
    roleName: string,
    preset: keyof typeof ROLE_ICON_PRESETS
  ): Promise<boolean> => {
    const presetIcons = ROLE_ICON_PRESETS[preset];
    if (!presetIcons) return false;
    
    return updateRoleConfig(
      roleName.toLowerCase(),
      roleName,
      presetIcons
    );
  }, [updateRoleConfig]);

  // Get user roles
  const userRoles = useMemo(() => {
    if (!user) return [];
    
    const roles: string[] = [];
    
    if (user.roleType) {
      roles.push(user.roleType);
    }
    
    if (user.roles && Array.isArray(user.roles)) {
      user.roles.forEach((r: any) => {
        const roleName = r.name || r.role?.name;
        if (roleName) roles.push(roleName);
      });
    }
    
    return roles;
  }, [user]);

  // Calculate current permissions
  const currentPermissions = useMemo((): IconPermissionItem[] => {
    if (!isAuthenticated) {
      return config?.guestConfig || GUEST_ICON_PERMISSIONS;
    }

    if (userRoles.length === 0) {
      return config?.defaults || DEFAULT_ICON_PERMISSIONS;
    }

    if (config) {
      const rolePermissions = userRoles.map(roleName => {
        const roleConfig = config.roles.find(
          r => r.roleName.toLowerCase() === roleName.toLowerCase()
        );
        if (roleConfig) return roleConfig.icons;
        
        // Fallback to preset
        const preset = ROLE_ICON_PRESETS[roleName] || ROLE_ICON_PRESETS[roleName.toUpperCase()];
        return preset || config.defaults;
      });
      return mergeIconPermissions(rolePermissions);
    }

    // No config - use presets
    const rolePermissions = userRoles.map(roleName => {
      const preset = ROLE_ICON_PRESETS[roleName] || ROLE_ICON_PRESETS[roleName.toUpperCase()];
      return preset || DEFAULT_ICON_PERMISSIONS;
    });
    return mergeIconPermissions(rolePermissions);
  }, [isAuthenticated, userRoles, config]);

  // Helpers
  const checkIconPermission = useCallback((
    iconType: IconType,
    position: 'external' | 'dropdown'
  ): boolean => {
    const perm = currentPermissions.find(p => p.iconType === iconType);
    if (!perm || !perm.enabled) return false;
    return perm.position === position || perm.position === 'both';
  }, [currentPermissions]);

  const getIconPosition = useCallback((iconType: IconType): IconPosition => {
    const perm = currentPermissions.find(p => p.iconType === iconType);
    return perm?.position || 'none';
  }, [currentPermissions]);

  const isIconEnabled = useCallback((iconType: IconType): boolean => {
    const perm = currentPermissions.find(p => p.iconType === iconType);
    return perm?.enabled ?? false;
  }, [currentPermissions]);

  // HeaderActions config
  const headerActionsConfig = useMemo(() => ({
    showNotifications: checkIconPermission('notifications', 'external'),
    showApps: checkIconPermission('apps', 'external'),
    showChat: checkIconPermission('chat', 'external'),
    showUser: isIconEnabled('user'),
    userConfig: {
      showNotifications: checkIconPermission('notifications', 'dropdown'),
      showApps: checkIconPermission('apps', 'dropdown'),
      showChat: checkIconPermission('chat', 'dropdown'),
      showQuickActions: isIconEnabled('quickActions'),
    },
  }), [checkIconPermission, isIconEnabled]);

  // Load on mount
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Context value
  const value: IconPermissionContextValue = {
    config,
    loading,
    error,
    currentPermissions,
    userRoles,
    loadConfig,
    saveConfig,
    updateRoleConfig,
    deleteRoleConfig,
    resetToDefaults,
    applyPreset,
    checkIconPermission,
    getIconPosition,
    isIconEnabled,
    headerActionsConfig,
    availableIcons: CONFIGURABLE_ICONS,
    availablePresets: ROLE_ICON_PRESETS,
  };

  return (
    <IconPermissionContext.Provider value={value}>
      {children}
    </IconPermissionContext.Provider>
  );
}

// Hook to use context
export function useIconPermissionContext() {
  const context = useContext(IconPermissionContext);
  if (!context) {
    throw new Error('useIconPermissionContext must be used within IconPermissionProvider');
  }
  return context;
}

// Export default for easier imports
export default IconPermissionContext;
