'use client';

import { useMemo } from 'react';
import { HeaderActions, HeaderActionsProps, AppModule, UserMenuItem } from './HeaderActions';
import { useIconPermissions } from '@/hooks/useIconPermissions';

/**
 * Smart HeaderActions component tự động áp dụng icon permissions
 * dựa trên role của user hiện tại.
 * 
 * Sử dụng component này thay vì HeaderActions trực tiếp để tự động
 * hiển thị/ẩn icons theo cấu hình phân quyền.
 */

// Props cho SmartHeaderActions - override một số props của HeaderActions
interface SmartHeaderActionsProps extends Omit<
  HeaderActionsProps,
  'showNotifications' | 'showApps' | 'showChat' | 'userConfig'
> {
  // Cho phép override nếu cần
  overridePermissions?: {
    showNotifications?: boolean;
    showApps?: boolean;
    showChat?: boolean;
    showUser?: boolean;
    userConfig?: {
      showNotifications?: boolean;
      showApps?: boolean;
      showChat?: boolean;
      showQuickActions?: boolean;
    };
  };
  // Debug mode để log config
  debug?: boolean;
}

export function SmartHeaderActions({
  variant = 'light',
  showUser = true,
  className,
  appModules,
  userMenuItems,
  guestMenuItems,
  onLogout,
  onChatClick,
  overridePermissions,
  debug = false,
}: SmartHeaderActionsProps) {
  // Lấy config từ hook
  const { headerActionsConfig, loading, currentPermissions, userRoles } = useIconPermissions();

  // Merge config với override
  const finalConfig = useMemo(() => {
    if (overridePermissions) {
      return {
        showNotifications: overridePermissions.showNotifications ?? headerActionsConfig.showNotifications,
        showApps: overridePermissions.showApps ?? headerActionsConfig.showApps,
        showChat: overridePermissions.showChat ?? headerActionsConfig.showChat,
        showUser: overridePermissions.showUser ?? showUser,
        userConfig: {
          showNotifications: overridePermissions.userConfig?.showNotifications ?? headerActionsConfig.userConfig.showNotifications,
          showApps: overridePermissions.userConfig?.showApps ?? headerActionsConfig.userConfig.showApps,
          showChat: overridePermissions.userConfig?.showChat ?? headerActionsConfig.userConfig.showChat,
          showQuickActions: overridePermissions.userConfig?.showQuickActions ?? headerActionsConfig.userConfig.showQuickActions,
        },
      };
    }
    return {
      ...headerActionsConfig,
      showUser,
    };
  }, [headerActionsConfig, overridePermissions, showUser]);

  // Debug log
  if (debug) {
    console.log('[SmartHeaderActions] Config:', {
      userRoles,
      currentPermissions,
      finalConfig,
    });
  }

  // Loading state - render basic user icon
  if (loading) {
    return (
      <HeaderActions
        variant={variant}
        showUser={true}
        showNotifications={false}
        showApps={false}
        showChat={false}
        className={className}
        onLogout={onLogout}
      />
    );
  }

  return (
    <HeaderActions
      variant={variant}
      showNotifications={finalConfig.showNotifications}
      showApps={finalConfig.showApps}
      showChat={finalConfig.showChat}
      showUser={finalConfig.showUser}
      userConfig={finalConfig.userConfig}
      className={className}
      appModules={appModules}
      userMenuItems={userMenuItems}
      guestMenuItems={guestMenuItems}
      onLogout={onLogout}
      onChatClick={onChatClick}
    />
  );
}

/**
 * Export cả hai để linh hoạt:
 * - SmartHeaderActions: Tự động theo phân quyền
 * - HeaderActions: Manual config
 */
export { HeaderActions };
export type { HeaderActionsProps, AppModule, UserMenuItem };
