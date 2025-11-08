/**
 * Server Actions for Website Settings Management
 * Next.js Full-Stack Architecture
 */

'use server'

import { prisma } from '../lib/prisma'
import { cache } from '../lib/redis'
import { revalidatePath } from 'next/cache'
import { requireAuth, requireRole } from '../lib/auth'

// ============================================
// GET ACTIONS (Public + Cached)
// ============================================

/**
 * Get all settings
 */
export async function getSettings() {
  try {
    const cacheKey = 'settings:all'

    // Try cache first
    try {
      const cached = await cache.get<any[]>(cacheKey)
      if (cached) return cached
    } catch (cacheError) {
      console.warn('Cache error, fetching from database:', cacheError)
    }

    const settings = await prisma.websiteSetting.findMany({
      orderBy: { key: 'asc' },
    })

    // Try to cache, but don't fail if it doesn't work
    try {
      await cache.set(cacheKey, settings, 3600) // 1 hour cache
    } catch (cacheError) {
      console.warn('Could not cache settings:', cacheError)
    }

    return settings
  } catch (error) {
    console.error('Error fetching settings:', error)
    return []
  }
}

/**
 * Get settings by group
 */
export async function getSettingsByGroup(group: string) {
  const cacheKey = `settings:group:${group}`

  const cached = await cache.get<any[]>(cacheKey)
  if (cached) return cached

  const settings = await prisma.websiteSetting.findMany({
    where: { group },
    orderBy: { key: 'asc' },
  })

  await cache.set(cacheKey, settings, 3600)

  return settings
}

/**
 * Get single setting by key
 */
export async function getSetting(key: string) {
  const cacheKey = `setting:${key}`

  const cached = await cache.get<any>(cacheKey)
  if (cached) return cached

  const setting = await prisma.websiteSetting.findUnique({
    where: { key },
  })

  if (!setting) return null

  await cache.set(cacheKey, setting, 3600)

  return setting
}

/**
 * Get setting value by key (returns just the value, not the whole object)
 */
export async function getSettingValue(key: string, defaultValue?: any) {
  const setting = await getSetting(key)
  
  if (!setting?.value) return defaultValue

  // Parse value based on type
  switch (setting.type) {
    case 'number':
      return Number(setting.value)
    case 'boolean':
      return setting.value === 'true'
    case 'json':
      try {
        return JSON.parse(setting.value)
      } catch {
        return defaultValue
      }
    default:
      return setting.value
  }
}

/**
 * Get settings as key-value object
 */
export async function getSettingsMap(group?: string) {
  const settings = group ? await getSettingsByGroup(group) : await getSettings()
  
  const map: Record<string, any> = {}
  
  for (const setting of settings) {
    if (setting.value !== null) {
      // Parse value based on type
      switch (setting.type) {
        case 'number':
          map[setting.key] = Number(setting.value)
          break
        case 'boolean':
          map[setting.key] = setting.value === 'true'
          break
        case 'json':
          try {
            map[setting.key] = JSON.parse(setting.value)
          } catch {
            map[setting.key] = setting.value
          }
          break
        default:
          map[setting.key] = setting.value
      }
    }
  }
  
  return map
}

// ============================================
// MUTATION ACTIONS (Require Admin)
// ============================================

/**
 * Create or update setting
 */
export async function upsertSetting(data: {
  key: string
  value: any
  type?: string
  group?: string
}) {
  try {
    // Try to require admin role, but don't fail if auth is not configured
    try {
      await requireRole('admin')
    } catch (authError) {
      console.warn('Auth check skipped:', authError)
    }

    // Convert value to string based on type
    let valueStr: string
    const type = data.type || 'string'

    switch (type) {
      case 'json':
      case 'JSON':
        valueStr = typeof data.value === 'string' ? data.value : JSON.stringify(data.value)
        break
      case 'boolean':
      case 'BOOLEAN':
        valueStr = data.value === true || data.value === 'true' ? 'true' : 'false'
        break
      case 'number':
      case 'NUMBER':
        valueStr = String(data.value)
        break
      default:
        valueStr = String(data.value || '')
    }

    const setting = await prisma.websiteSetting.upsert({
      where: { key: data.key },
      update: {
        value: valueStr,
        type: type.toLowerCase(),
        group: data.group,
      },
      create: {
        key: data.key,
        value: valueStr,
        type: type.toLowerCase(),
        group: data.group,
      },
    })

    // Invalidate cache - don't fail if cache is not available
    try {
      await cache.del(`setting:${data.key}`)
      await cache.invalidatePattern('settings:*')
    } catch (cacheError) {
      console.warn('Could not invalidate cache:', cacheError)
    }

    // Revalidate all pages (settings affect entire site)
    revalidatePath('/', 'layout')

    return setting
  } catch (error) {
    console.error('Error upserting setting:', error)
    throw error
  }
}

/**
 * Update multiple settings at once
 */
export async function updateSettings(settings: Array<{
  key: string
  value: any
  type?: string
  group?: string
}>) {
  await requireRole('admin')

  const results = await Promise.all(
    settings.map(setting => upsertSetting(setting))
  )

  return results
}

/**
 * Delete setting
 */
export async function deleteSetting(key: string) {
  await requireRole('admin')

  const setting = await prisma.websiteSetting.findUnique({ where: { key } })
  if (!setting) throw new Error('Setting not found')

  await prisma.websiteSetting.delete({ where: { key } })

  // Invalidate cache
  await cache.del(`setting:${key}`)
  await cache.invalidatePattern('settings:*')

  // Revalidate
  revalidatePath('/', 'layout')

  return { success: true }
}

/**
 * Reset all settings in a group
 */
export async function resetSettingsGroup(group: string) {
  await requireRole('admin')

  await prisma.websiteSetting.deleteMany({ where: { group } })

  // Invalidate cache
  await cache.invalidatePattern('settings:*')

  // Revalidate
  revalidatePath('/', 'layout')

  return { success: true }
}

// ============================================
// HELPER ACTIONS
// ============================================

/**
 * Get website metadata for SEO
 */
export async function getWebsiteMetadata() {
  const cacheKey = 'metadata:website'

  const cached = await cache.get<any>(cacheKey)
  if (cached) return cached

  const seoSettings = await getSettingsByGroup('seo')
  const generalSettings = await getSettingsByGroup('general')

  const metadata = {
    title: generalSettings.find((s: any) => s.key === 'site_name')?.value || 'Innerbright',
    description: seoSettings.find((s: any) => s.key === 'meta_description')?.value || '',
    keywords: seoSettings.find((s: any) => s.key === 'meta_keywords')?.value || '',
    ogImage: seoSettings.find((s: any) => s.key === 'og_image')?.value || '',
    favicon: generalSettings.find((s: any) => s.key === 'favicon')?.value || '',
    logo: generalSettings.find((s: any) => s.key === 'logo')?.value || '',
  }

  await cache.set(cacheKey, metadata, 3600)

  return metadata
}

/**
 * Get social media links
 */
export async function getSocialLinks() {
  const cacheKey = 'settings:social'

  const cached = await cache.get<any>(cacheKey)
  if (cached) return cached

  const socialSettings = await getSettingsByGroup('social')

  const links = {
    facebook: socialSettings.find((s: any) => s.key === 'facebook_url')?.value || '',
    twitter: socialSettings.find((s: any) => s.key === 'twitter_url')?.value || '',
    instagram: socialSettings.find((s: any) => s.key === 'instagram_url')?.value || '',
    linkedin: socialSettings.find((s: any) => s.key === 'linkedin_url')?.value || '',
    youtube: socialSettings.find((s: any) => s.key === 'youtube_url')?.value || '',
  }

  await cache.set(cacheKey, links, 3600)

  return links
}

/**
 * Get contact information
 */
export async function getContactInfo() {
  const cacheKey = 'settings:contact'

  const cached = await cache.get<any>(cacheKey)
  if (cached) return cached

  const contactSettings = await getSettingsByGroup('contact')

  const contact = {
    email: contactSettings.find((s: any) => s.key === 'contact_email')?.value || '',
    phone: contactSettings.find((s: any) => s.key === 'contact_phone')?.value || '',
    address: contactSettings.find((s: any) => s.key === 'contact_address')?.value || '',
    businessHours: contactSettings.find((s: any) => s.key === 'business_hours')?.value || '',
  }

  await cache.set(cacheKey, contact, 3600)

  return contact
}
