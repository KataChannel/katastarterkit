'use client';

import { useEffect, useState } from 'react';
import { AnalyticsScripts } from './AnalyticsScripts';
import { gql, useQuery } from '@apollo/client';

const GET_ANALYTICS_SETTINGS = gql`
  query GetAnalyticsSettings {
    publicWebsiteSettings(category: ANALYTICS) {
      key
      value
    }
  }
`;

interface AnalyticsSetting {
  key: string;
  value: string | null;
}

interface AnalyticsConfig {
  googleAnalyticsId?: string;
  googleAnalyticsEnabled?: boolean;
  googleTagManagerId?: string;
  googleTagManagerEnabled?: boolean;
  facebookPixelId?: string;
  facebookPixelEnabled?: boolean;
  facebookPixelEvents?: any;
  tiktokPixelId?: string;
  tiktokPixelEnabled?: boolean;
}

function parseSettings(settings: AnalyticsSetting[]): AnalyticsConfig {
  const config: AnalyticsConfig = {};

  settings.forEach((setting) => {
    switch (setting.key) {
      case 'analytics.google_analytics_id':
        config.googleAnalyticsId = setting.value || undefined;
        break;
      case 'analytics.google_analytics_enabled':
        config.googleAnalyticsEnabled = setting.value === 'true';
        break;
      case 'analytics.google_tag_manager_id':
        config.googleTagManagerId = setting.value || undefined;
        break;
      case 'analytics.google_tag_manager_enabled':
        config.googleTagManagerEnabled = setting.value === 'true';
        break;
      case 'analytics.facebook_pixel_id':
        config.facebookPixelId = setting.value || undefined;
        break;
      case 'analytics.facebook_pixel_enabled':
        config.facebookPixelEnabled = setting.value === 'true';
        break;
      case 'analytics.facebook_pixel_events':
        try {
          config.facebookPixelEvents = setting.value ? JSON.parse(setting.value) : undefined;
        } catch (e) {
          console.error('Failed to parse facebook pixel events:', e);
        }
        break;
      case 'analytics.tiktok_pixel_id':
        config.tiktokPixelId = setting.value || undefined;
        break;
      case 'analytics.tiktok_pixel_enabled':
        config.tiktokPixelEnabled = setting.value === 'true';
        break;
    }
  });

  return config;
}

export function AnalyticsWrapper() {
  const [config, setConfig] = useState<AnalyticsConfig>({});
  const { data, loading, error } = useQuery(GET_ANALYTICS_SETTINGS, {
    fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (data?.publicWebsiteSettings) {
      const parsedConfig = parseSettings(data.publicWebsiteSettings);
      setConfig(parsedConfig);
    }
  }, [data]);

  if (loading || error) {
    return null;
  }

  // Only render if at least one analytics service is enabled
  const hasAnalytics =
    config.googleAnalyticsEnabled ||
    config.googleTagManagerEnabled ||
    config.facebookPixelEnabled ||
    config.tiktokPixelEnabled;

  if (!hasAnalytics) {
    return null;
  }

  return <AnalyticsScripts config={config} />;
}
