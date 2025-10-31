import { useFindMany } from './useDynamicGraphQL';

export interface WebsiteSetting {
  id: string;
  key: string;
  value: string | null;
  type: 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'BOOLEAN' | 'COLOR' | 'IMAGE' | 'URL' | 'JSON' | 'SELECT';
  category: 'GENERAL' | 'HEADER' | 'FOOTER' | 'SEO' | 'SOCIAL' | 'CONTACT' | 'APPEARANCE' | 'ANALYTICS' | 'PAYMENT' | 'SHIPPING';
  label: string;
  description?: string | null;
  group?: string | null;
  order: number;
  isActive: boolean;
  isPublic: boolean;
  options?: any;
  validation?: any;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteSettings {
  // General
  'site.name'?: string;
  'site.tagline'?: string;
  'site.description'?: string;

  // Header
  'header.enabled'?: boolean;
  'header.logo'?: string;
  'header.logo_width'?: number;
  'header.background_color'?: string;
  'header.text_color'?: string;
  'header.show_search'?: boolean;
  'header.show_cart'?: boolean;
  'header.show_user_menu'?: boolean;
  'header.banner_enabled'?: boolean;
  'header.banner_height'?: number;
  'header.banner_autoplay'?: boolean;
  'header.banner_interval'?: number;

  // Footer
  'footer.enabled'?: boolean;
  'footer.background_color'?: string;
  'footer.text_color'?: string;
  'footer.show_visitor_stats'?: boolean;
  'footer.show_social_links'?: boolean;

  // Contact
  'contact.company_name'?: string;
  'contact.address'?: string;
  'contact.phone'?: string;
  'contact.phone_display'?: string;
  'contact.email'?: string;

  // Social
  'social.facebook'?: string;
  'social.facebook_enabled'?: boolean;
  'social.tiktok'?: string;
  'social.tiktok_enabled'?: boolean;
  'social.youtube'?: string;
  'social.youtube_enabled'?: boolean;

  // SEO
  'seo.meta_title'?: string;
  'seo.meta_description'?: string;
  'seo.keywords'?: string;
  'seo.og_image'?: string;

  // Appearance
  'appearance.primary_color'?: string;
  'appearance.secondary_color'?: string;
  'appearance.accent_color'?: string;

  [key: string]: any;
}

/**
 * Hook để lấy tất cả website settings
 */
export function useWebsiteSettings(category?: string) {
  const where: any = {
    isActive: true,
    isPublic: true,
  };

  if (category) {
    where.category = category;
  }

  return useFindMany<WebsiteSetting>('WebsiteSetting', {
    where,
    orderBy: { order: 'asc' }, // Fix: orderBy must be object, not array
  });
}

/**
 * Hook để lấy header settings
 */
export function useHeaderSettings() {
  return useFindMany<WebsiteSetting>('WebsiteSetting', {
    where: {
      category: 'HEADER',
      isActive: true,
      isPublic: true,
    },
    orderBy: { order: 'asc' },
  });
}

/**
 * Hook để lấy footer settings
 */
export function useFooterSettings() {
  return useFindMany<WebsiteSetting>('WebsiteSetting', {
    where: {
      category: 'FOOTER',
      isActive: true,
      isPublic: true,
    },
    orderBy: { order: 'asc' },
  });
}

/**
 * Hook để lấy contact settings
 */
export function useContactSettings() {
  return useFindMany<WebsiteSetting>('WebsiteSetting', {
    where: {
      category: 'CONTACT',
      isActive: true,
      isPublic: true,
    },
    orderBy: { order: 'asc' },
  });
}

/**
 * Hook để lấy social settings
 */
export function useSocialSettings() {
  return useFindMany<WebsiteSetting>('WebsiteSetting', {
    where: {
      category: 'SOCIAL',
      isActive: true,
      isPublic: true,
    },
    orderBy: { order: 'asc' },
  });
}

/**
 * Helper function để parse giá trị setting theo type
 */
export function parseSettingValue(setting: WebsiteSetting): any {
  if (!setting.value) return null;

  switch (setting.type) {
    case 'BOOLEAN':
      return setting.value === 'true';
    case 'NUMBER':
      return parseFloat(setting.value);
    case 'JSON':
      try {
        return JSON.parse(setting.value);
      } catch {
        return null;
      }
    default:
      return setting.value;
  }
}

/**
 * Helper function để convert array of settings thành key-value object
 */
export function settingsToMap(settings: WebsiteSetting[]): WebsiteSettings {
  return settings.reduce((acc, setting) => {
    acc[setting.key] = parseSettingValue(setting);
    return acc;
  }, {} as WebsiteSettings);
}

/**
 * Hook để lấy settings dạng key-value map
 */
export function useWebsiteSettingsMap(category?: string) {
  const { data: settings = [], loading, error } = useWebsiteSettings(category);
  
  const settingsMap = settingsToMap(settings);

  return {
    settings: settingsMap,
    loading,
    error,
  };
}

/**
 * Hook để lấy 1 setting cụ thể theo key
 */
export function useWebsiteSetting(key: string) {
  const { settings, loading, error } = useWebsiteSettingsMap();
  
  return {
    value: settings[key],
    loading,
    error,
  };
}
