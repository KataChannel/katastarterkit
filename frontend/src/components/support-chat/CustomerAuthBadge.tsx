import { Phone, MessageCircle, Facebook, Chrome, User, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export type CustomerAuthType = 'GUEST' | 'PHONE' | 'ZALO' | 'FACEBOOK' | 'GOOGLE' | 'USER_ACCOUNT';

interface CustomerAuthBadgeProps {
  authType: CustomerAuthType;
  customerName?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const AUTH_CONFIG = {
  GUEST: {
    icon: User,
    label: 'Khách',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    iconColor: 'text-gray-600',
    emoji: '👤',
  },
  PHONE: {
    icon: Phone,
    label: 'Số điện thoại',
    color: 'bg-green-100 text-green-800 border-green-300',
    iconColor: 'text-green-600',
    emoji: '📱',
  },
  ZALO: {
    icon: MessageCircle,
    label: 'Zalo',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    iconColor: 'text-blue-600',
    emoji: '💬',
  },
  FACEBOOK: {
    icon: Facebook,
    label: 'Facebook',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    iconColor: 'text-indigo-600',
    emoji: '👥',
  },
  GOOGLE: {
    icon: Chrome,
    label: 'Google',
    color: 'bg-red-100 text-red-800 border-red-300',
    iconColor: 'text-red-600',
    emoji: '🔍',
  },
  USER_ACCOUNT: {
    icon: Lock,
    label: 'Tài khoản',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    iconColor: 'text-purple-600',
    emoji: '🔐',
  },
};

export function CustomerAuthBadge({
  authType,
  customerName,
  showLabel = true,
  size = 'md',
}: CustomerAuthBadgeProps) {
  const config = AUTH_CONFIG[authType] || AUTH_CONFIG.GUEST;
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const badgeSizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  if (showLabel) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant="outline"
              className={`${config.color} ${badgeSizes[size]} inline-flex items-center gap-1.5 font-medium border`}
            >
              <Icon className={`${sizeClasses[size]} ${config.iconColor}`} />
              <span>{config.label}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              {customerName ? `${customerName} - ` : ''}
              Đăng nhập qua {config.label}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Icon only
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex">
            <Icon className={`${sizeClasses[size]} ${config.iconColor}`} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">
            {customerName ? `${customerName} - ` : ''}
            {config.label}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function getAuthEmoji(authType: CustomerAuthType): string {
  return AUTH_CONFIG[authType]?.emoji || '👤';
}

export function getAuthLabel(authType: CustomerAuthType): string {
  return AUTH_CONFIG[authType]?.label || 'Khách';
}

export function getAuthColor(authType: CustomerAuthType): string {
  return AUTH_CONFIG[authType]?.color || AUTH_CONFIG.GUEST.color;
}
