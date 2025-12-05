'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  getIconPermissionsForRole,
  isIconAllowed,
  mergeIconPermissions,
} from '@/types/icon-permission';

// Storage key cho localStorage
const STORAGE_KEY = 'icon_permissions_config';

// Custom event name for config changes
const CONFIG_CHANGE_EVENT = 'icon_permissions_config_changed';

// Hook để quản lý icon permissions
export function useIconPermissions() {
  const { user, isAuthenticated } = useAuth();
  const { hasRole, hasAnyRole } = useRole();
  
  const [config, setConfig] = useState<IconPermissionConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load config từ localStorage hoặc API
  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      
      // Thử load từ localStorage trước
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as IconPermissionConfig;
        setConfig(parsed);
      }
      
      // TODO: Load từ API nếu cần
      // const response = await fetch('/api/settings/icon-permissions');
      // const data = await response.json();
      // setConfig(data);
      // localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load config'));
    } finally {
      setLoading(false);
    }
  }, []);

  // Save config
  const saveConfig = useCallback(async (newConfig: IconPermissionConfig) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      setConfig(newConfig);
      
      // Dispatch custom event để các component khác biết config đã thay đổi
      window.dispatchEvent(new CustomEvent(CONFIG_CHANGE_EVENT, { detail: newConfig }));
      
      // TODO: Save to API
      // await fetch('/api/settings/icon-permissions', {
      //   method: 'POST',
      //   body: JSON.stringify(newConfig),
      // });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save config'));
      return false;
    }
  }, []);

  // Update config for a specific role
  const updateRoleConfig = useCallback(async (
    roleId: string,
    roleName: string,
    icons: IconPermissionItem[]
  ) => {
    const newConfig: IconPermissionConfig = config || {
      roles: [],
      defaults: DEFAULT_ICON_PERMISSIONS,
      guestConfig: GUEST_ICON_PERMISSIONS,
    };

    const existingIndex = newConfig.roles.findIndex(r => r.roleId === roleId);
    const roleConfig: RoleIconPermission = {
      roleId,
      roleName,
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

  // Lấy user's roles
  const userRoles = useMemo(() => {
    if (!user) return [];
    
    const roles: string[] = [];
    
    // System roleType
    if (user.roleType) {
      roles.push(user.roleType);
    }
    
    // RBAC roles
    if (user.roles && Array.isArray(user.roles)) {
      user.roles.forEach((r: any) => {
        const roleName = r.name || r.role?.name;
        if (roleName) roles.push(roleName);
      });
    }
    
    return roles;
  }, [user]);

  // Tính toán permissions cho user hiện tại
  const currentPermissions = useMemo((): IconPermissionItem[] => {
    // Guest
    if (!isAuthenticated) {
      return config?.guestConfig || GUEST_ICON_PERMISSIONS;
    }

    // Không có role -> dùng defaults
    if (userRoles.length === 0) {
      return config?.defaults || DEFAULT_ICON_PERMISSIONS;
    }

    // Có custom config
    if (config) {
      const rolePermissions = userRoles.map(roleName => {
        const roleConfig = config.roles.find(
          r => r.roleName.toLowerCase() === roleName.toLowerCase()
        );
        return roleConfig?.icons || getIconPermissionsForRole(roleName);
      });
      return mergeIconPermissions(rolePermissions);
    }

    // Không có config -> dùng presets
    const rolePermissions = userRoles.map(roleName => {
      const preset = ROLE_ICON_PRESETS[roleName] || ROLE_ICON_PRESETS[roleName.toUpperCase()];
      return preset || DEFAULT_ICON_PERMISSIONS;
    });
    return mergeIconPermissions(rolePermissions);
  }, [isAuthenticated, userRoles, config]);

  // Helper: Check if icon is allowed in position
  const checkIconPermission = useCallback((
    iconType: IconType,
    position: 'external' | 'dropdown'
  ): boolean => {
    return isIconAllowed(iconType, position, currentPermissions);
  }, [currentPermissions]);

  // Helper: Get icon position
  const getIconPosition = useCallback((iconType: IconType): IconPosition => {
    const perm = currentPermissions.find(p => p.iconType === iconType);
    return perm?.position || 'none';
  }, [currentPermissions]);

  // Helper: Check if icon is enabled
  const isIconEnabled = useCallback((iconType: IconType): boolean => {
    const perm = currentPermissions.find(p => p.iconType === iconType);
    return perm?.enabled ?? false;
  }, [currentPermissions]);

  // Computed values for HeaderActions
  const headerActionsConfig = useMemo(() => ({
    // External icons
    showNotifications: checkIconPermission('notifications', 'external'),
    showApps: checkIconPermission('apps', 'external'),
    showChat: checkIconPermission('chat', 'external'),
    showUser: isIconEnabled('user'),
    
    // User dropdown config
    userConfig: {
      showNotifications: checkIconPermission('notifications', 'dropdown'),
      showApps: checkIconPermission('apps', 'dropdown'),
      showChat: checkIconPermission('chat', 'dropdown'),
      showQuickActions: isIconEnabled('quickActions'),
    },
  }), [checkIconPermission, isIconEnabled]);

  // Load config on mount
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  // Listen for config changes from other tabs/windows or custom events
  useEffect(() => {
    // Handler for localStorage changes (cross-tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const newConfig = JSON.parse(e.newValue) as IconPermissionConfig;
          setConfig(newConfig);
        } catch (err) {
          console.error('Failed to parse updated config:', err);
        }
      }
    };

    // Handler for custom event (same tab)
    const handleConfigChange = (e: CustomEvent<IconPermissionConfig>) => {
      setConfig(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(CONFIG_CHANGE_EVENT, handleConfigChange as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(CONFIG_CHANGE_EVENT, handleConfigChange as EventListener);
    };
  }, []);

  return {
    // State
    config,
    loading,
    error,
    currentPermissions,
    userRoles,
    
    // Actions
    loadConfig,
    saveConfig,
    updateRoleConfig,
    
    // Helpers
    checkIconPermission,
    getIconPosition,
    isIconEnabled,
    
    // Ready-to-use config for HeaderActions
    headerActionsConfig,
  };
}

// Hook đơn giản chỉ để lấy config cho HeaderActions
export function useHeaderActionsPermissions() {
  const { headerActionsConfig, loading } = useIconPermissions();
  return { config: headerActionsConfig, loading };
}
