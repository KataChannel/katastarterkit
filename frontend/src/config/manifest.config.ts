/**
 * Domain-specific PWA manifest configurations
 * Sử dụng file này để cấu hình manifest.json cho từng domain
 */

export interface ManifestShortcut {
  name: string;
  short_name: string;
  description: string;
  url: string;
  icons?: Array<{
    src: string;
    sizes: string;
    type: string;
  }>;
}

export interface DomainManifestConfig {
  name: string;
  short_name: string;
  description: string;
  theme_color: string;
  background_color: string;
  lang: string;
  categories: string[];
  shortcuts?: ManifestShortcut[];
  icons?: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }>;
}

export const domainManifestConfigs: Record<string, DomainManifestConfig> = {
  /**
   * Rau Sạch Trần Gia - Nông sản thực phẩm sạch
   */
  rausach: {
    name: 'Rau Sạch Trần Gia',
    short_name: 'Rau Sạch',
    description: 'Nông sản thực phẩm sạch - Rau sạch chất lượng cao từ trang trại đến bàn ăn',
    theme_color: '#22C55E', // Green 500 - màu xanh lá cho rau sạch
    background_color: '#F0FDF4', // Green 50
    lang: 'vi-VN',
    categories: ['food', 'shopping', 'lifestyle'],
    shortcuts: [
      {
        name: 'Sản phẩm',
        short_name: 'Sản phẩm',
        description: 'Xem danh sách sản phẩm rau sạch',
        url: '/san-pham'
      },
      {
        name: 'Giỏ hàng',
        short_name: 'Giỏ hàng',
        description: 'Xem giỏ hàng của bạn',
        url: '/gio-hang'
      },
      {
        name: 'Đơn hàng',
        short_name: 'Đơn hàng',
        description: 'Theo dõi đơn hàng',
        url: '/don-hang'
      }
    ]
  },

  /**
   * TazaGroup - Hệ thống quản lý doanh nghiệp
   */
  tazagroup: {
    name: 'TazaGroup',
    short_name: 'TazaGroup',
    description: 'Hệ thống quản lý doanh nghiệp TazaGroup - ERP, HRM, CRM',
    theme_color: '#3B82F6', // Blue 500 - màu xanh dương cho doanh nghiệp
    background_color: '#EFF6FF', // Blue 50
    lang: 'vi-VN',
    categories: ['business', 'productivity', 'utilities'],
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'Xem tổng quan hệ thống',
        url: '/dashboard'
      },
      {
        name: 'Nhân viên',
        short_name: 'Nhân viên',
        description: 'Quản lý nhân viên',
        url: '/admin/employees'
      },
      {
        name: 'Báo cáo',
        short_name: 'Báo cáo',
        description: 'Xem báo cáo',
        url: '/reports'
      }
    ]
  },

  /**
   * Timona - Nền tảng học trực tuyến
   */
  timona: {
    name: 'Timona Learning',
    short_name: 'Timona',
    description: 'Nền tảng học trực tuyến Timona - Học mọi lúc, mọi nơi',
    theme_color: '#8B5CF6', // Purple 500 - màu tím cho giáo dục
    background_color: '#F5F3FF', // Purple 50
    lang: 'vi-VN',
    categories: ['education', 'learning', 'productivity'],
    shortcuts: [
      {
        name: 'Khóa học',
        short_name: 'Khóa học',
        description: 'Xem các khóa học',
        url: '/courses'
      },
      {
        name: 'Học tập',
        short_name: 'Học tập',
        description: 'Tiếp tục học',
        url: '/learning'
      },
      {
        name: 'Chứng chỉ',
        short_name: 'Chứng chỉ',
        description: 'Xem chứng chỉ của bạn',
        url: '/certificates'
      }
    ]
  },

  /**
   * Default - Cấu hình mặc định
   */
  default: {
    name: 'KataCore Platform',
    short_name: 'KataCore',
    description: 'Nền tảng quản lý đa năng KataCore',
    theme_color: '#3B82F6',
    background_color: '#FFFFFF',
    lang: 'vi-VN',
    categories: ['productivity', 'business', 'utilities'],
    shortcuts: [
      {
        name: 'Dashboard',
        short_name: 'Dashboard',
        description: 'Xem tổng quan',
        url: '/dashboard'
      },
      {
        name: 'Cài đặt',
        short_name: 'Cài đặt',
        description: 'Cấu hình hệ thống',
        url: '/settings'
      }
    ]
  }
};

/**
 * Xác định domain key từ hostname
 */
export function getDomainKeyFromHost(host: string): string {
  const hostname = host.split(':')[0].toLowerCase();
  
  // Kiểm tra các patterns
  if (hostname.includes('rausach') || hostname.includes('trangia') || hostname.includes('rau')) {
    return 'rausach';
  }
  if (hostname.includes('tazagroup') || hostname.includes('taza')) {
    return 'tazagroup';
  }
  if (hostname.includes('timona')) {
    return 'timona';
  }
  
  return 'default';
}

/**
 * Lấy manifest config cho domain
 */
export function getManifestConfigForDomain(host: string): DomainManifestConfig {
  const domainKey = getDomainKeyFromHost(host);
  return domainManifestConfigs[domainKey] || domainManifestConfigs['default'];
}

/**
 * Default icons cho tất cả domains
 */
export const defaultManifestIcons = [
  {
    src: '/favicon-16x16.png',
    sizes: '16x16',
    type: 'image/png'
  },
  {
    src: '/favicon-32x32.png',
    sizes: '32x32',
    type: 'image/png'
  },
  {
    src: '/apple-touch-icon.png',
    sizes: '180x180',
    type: 'image/png'
  },
  {
    src: '/icons/icon-192x192.png',
    sizes: '192x192',
    type: 'image/png',
    purpose: 'maskable any'
  },
  {
    src: '/icons/icon-512x512.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable any'
  }
];
