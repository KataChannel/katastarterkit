/**
 * Settings API Route Handler
 * GET /api/settings - Get public settings
 * GET /api/settings?group=seo - Get settings by group
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSettings, getSettingsByGroup, getWebsiteMetadata } from '@/actions/settings.actions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const group = searchParams.get('group')
    const metadata = searchParams.get('metadata') === 'true'

    if (metadata) {
      const data = await getWebsiteMetadata()
      return NextResponse.json({
        success: true,
        data,
      })
    }

    const settings = group 
      ? await getSettingsByGroup(group)
      : await getSettings()

    // Convert to key-value format for easier consumption
    const settingsMap = settings.reduce((acc: any, setting: any) => {
      if (setting.value !== null) {
        acc[setting.key] = setting.value
      }
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data: settingsMap,
    })
  } catch (error) {
    console.error('Settings API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
