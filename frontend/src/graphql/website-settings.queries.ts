/**
 * DEPRECATED: GraphQL has been removed from this project
 * This file provides backward compatibility stubs
 * 
 * Migration Guide:
 * - Create Server Actions in @/actions/website-settings.ts
 * - Or create REST API: /api/website-settings
 */

// Type definitions
export interface WebsiteSetting {
  id: string;
  key: string;
  value: any;
  group?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HeaderSettings {
  logo?: string;
  navigation?: any[];
  ctaButton?: {
    text: string;
    url: string;
  };
}

export interface FooterSettings {
  columns?: any[];
  copyright?: string;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

// GraphQL query stubs
export const GET_PUBLIC_WEBSITE_SETTINGS = `
  # DEPRECATED: Create Server Action getPublicWebsiteSettings()
  query GetPublicWebsiteSettings {
    publicWebsiteSettings {
      id
      key
      value
    }
  }
`;

export const GET_HEADER_SETTINGS = `
  # DEPRECATED: Create Server Action getHeaderSettings()
  query GetHeaderSettings {
    headerSettings {
      logo
      navigation
      ctaButton {
        text
        url
      }
    }
  }
`;

export const GET_FOOTER_SETTINGS = `
  # DEPRECATED: Create Server Action getFooterSettings()
  query GetFooterSettings {
    footerSettings {
      columns
      copyright
      socialLinks {
        platform
        url
      }
    }
  }
`;

export const GET_ALL_WEBSITE_SETTINGS = `
  # DEPRECATED: Create Server Action getAllWebsiteSettings()
  query GetAllWebsiteSettings {
    websiteSettings {
      id
      key
      value
      group
    }
  }
`;

// GraphQL mutation stubs
export const UPDATE_WEBSITE_SETTING = `
  # DEPRECATED: Create Server Action updateWebsiteSetting(key, value)
  mutation UpdateWebsiteSetting($key: String!, $value: JSON!) {
    updateWebsiteSetting(key: $key, value: $value) {
      id
      key
      value
    }
  }
`;

export const UPDATE_HEADER_SETTINGS = `
  # DEPRECATED: Create Server Action updateHeaderSettings(data)
  mutation UpdateHeaderSettings($input: HeaderSettingsInput!) {
    updateHeaderSettings(input: $input) {
      logo
      navigation
    }
  }
`;

export const UPDATE_FOOTER_SETTINGS = `
  # DEPRECATED: Create Server Action updateFooterSettings(data)
  mutation UpdateFooterSettings($input: FooterSettingsInput!) {
    updateFooterSettings(input: $input) {
      columns
      copyright
    }
  }
`;

console.warn('⚠️ @/graphql/website-settings.queries is deprecated. Create @/actions/website-settings.ts with Server Actions.');
