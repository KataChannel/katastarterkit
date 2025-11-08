'use server';

import { getSettings } from '@/actions/settings.actions';

/**
 * API route handler for fetching website settings
 * This allows client components to fetch settings
 */
export async function fetchWebsiteSettings() {
  try {
    const settings = await getSettings();
    return { success: true, data: settings };
  } catch (error) {
    console.error('Error fetching settings:', error);
    return { success: false, data: [], error: (error as Error).message };
  }
}
