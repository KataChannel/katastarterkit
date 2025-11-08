'use client';

import { useState, useEffect, useMemo } from 'react';
import { getSettings, getSettingsByGroup } from '@/actions/settings.actions';

export interface WebsiteSetting {
  id: string;
  key: string;
  value: string | null;
  type?: string | null;
  group?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Convert settings array to key-value map with parsed values
 */
export function settingsToMap(settings: WebsiteSetting[]): Record<string, any> {
  const map: Record<string, any> = {};
  
  settings.forEach(setting => {
    if (setting.value !== null && setting.value !== undefined) {
      // Parse value based on type
      let parsedValue: any = setting.value;
      
      switch (setting.type?.toLowerCase()) {
        case 'number':
          parsedValue = Number(setting.value);
          break;
        case 'boolean':
          parsedValue = setting.value === 'true';
          break;
        case 'json':
          try {
            parsedValue = JSON.parse(setting.value);
          } catch {
            parsedValue = setting.value;
          }
          break;
        default:
          parsedValue = setting.value;
      }
      
      map[setting.key] = parsedValue;
    }
  });
  
  return map;
}

/**
 * Hook to fetch all website settings
 */
export function useWebsiteSettings() {
  const [data, setData] = useState<WebsiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchSettings = async () => {
      try {
        console.log('[useWebsiteSettings] Fetching settings...');
        setLoading(true);
        const settings = await getSettings();
        console.log('[useWebsiteSettings] Got settings:', settings?.length || 0);
        if (mounted) {
          setData(settings as WebsiteSetting[]);
          setError(null);
        }
      } catch (err) {
        console.error('[useWebsiteSettings] Error:', err);
        if (mounted) {
          setError(err as Error);
          setData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      mounted = false;
    };
  }, []);

  return { data, loading, error };
}

/**
 * Hook to fetch settings by group
 */
export function useSettingsByGroup(group: string) {
  const [data, setData] = useState<WebsiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const settings = await getSettingsByGroup(group);
        if (mounted) {
          setData(settings as WebsiteSetting[]);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setData([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchSettings();

    return () => {
      mounted = false;
    };
  }, [group]);

  return { data, loading, error };
}

/**
 * Hook to fetch header settings
 */
export function useHeaderSettings() {
  const { data: allSettings, loading, error } = useWebsiteSettings();
  
  const headerSettings = useMemo(() => {
    return allSettings.filter(s => s.key.startsWith('header.'));
  }, [allSettings]);

  return { data: headerSettings, loading, error };
}

/**
 * Hook to fetch footer settings
 */
export function useFooterSettings() {
  const { data: allSettings, loading, error } = useWebsiteSettings();
  
  const footerSettings = useMemo(() => {
    return allSettings.filter(s => s.key.startsWith('footer.'));
  }, [allSettings]);

  return { data: footerSettings, loading, error };
}

/**
 * Hook to fetch contact settings
 */
export function useContactSettings() {
  const { data: allSettings, loading, error } = useWebsiteSettings();
  
  const contactSettings = useMemo(() => {
    return allSettings.filter(s => s.key.startsWith('contact.'));
  }, [allSettings]);

  return { data: contactSettings, loading, error };
}

/**
 * Hook to fetch social settings
 */
export function useSocialSettings() {
  const { data: allSettings, loading, error } = useWebsiteSettings();
  
  const socialSettings = useMemo(() => {
    return allSettings.filter(s => s.key.startsWith('social.'));
  }, [allSettings]);

  return { data: socialSettings, loading, error };
}

/**
 * Hook to fetch SEO settings
 */
export function useSeoSettings() {
  const { data: allSettings, loading, error } = useWebsiteSettings();
  
  const seoSettings = useMemo(() => {
    return allSettings.filter(s => s.key.startsWith('seo.'));
  }, [allSettings]);

  return { data: seoSettings, loading, error };
}

/**
 * Hook to fetch appearance settings
 */
export function useAppearanceSettings() {
  const { data: allSettings, loading, error } = useWebsiteSettings();
  
  const appearanceSettings = useMemo(() => {
    return allSettings.filter(s => s.key.startsWith('appearance.'));
  }, [allSettings]);

  return { data: appearanceSettings, loading, error };
}

/**
 * Hook to get settings as a key-value map
 */
export function useWebsiteSettingsMap() {
  const { data, loading, error } = useWebsiteSettings();
  
  const settingsMap = useMemo(() => settingsToMap(data), [data]);

  return { data: settingsMap, loading, error };
}

/**
 * Hook to get a single setting value by key
 */
export function useWebsiteSetting(key: string) {
  const { data: settings, loading, error } = useWebsiteSettingsMap();
  
  return {
    value: settings[key],
    loading,
    error,
  };
}
