/**
 * Authentication Helper for Server Actions
 * Temporary simple version - will be replaced with NextAuth later
 */

import { cookies } from 'next/headers'
import { prisma } from './prisma'

export type AuthUser = {
  id: string
  email: string
  name: string | null
  role: string
}

/**
 * Get authenticated user from session
 * TODO: Replace with proper NextAuth implementation
 */
export async function auth(): Promise<{ user: AuthUser } | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session-token')?.value

    if (!sessionToken) {
      return null
    }

    // TODO: Implement proper session verification
    // For now, returning mock user for testing
    // In production, this should verify JWT or session token

    // Temporary: Get first user from database for testing
    const user = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        roleType: true,
      },
    })

    if (!user) {
      return null
    }

    return {
      user: {
        id: user.id,
        email: user.email || '',
        name: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}` 
          : user.username,
        role: user.roleType || 'USER',
      },
    }
  } catch (error) {
    console.error('Auth error:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth()
  return !!session?.user
}

/**
 * Check if user has specific role
 */
export async function hasRole(role: string): Promise<boolean> {
  const session = await auth()
  return session?.user?.role === role
}

/**
 * Require authentication (throws if not authenticated)
 */
export async function requireAuth(): Promise<AuthUser> {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized - Authentication required')
  }
  return session.user
}

/**
 * Require specific role (throws if not authorized)
 */
export async function requireRole(role: string): Promise<AuthUser> {
  const user = await requireAuth()
  if (user.role !== role && user.role !== 'admin') {
    throw new Error(`Unauthorized - ${role} role required`)
  }
  return user
}
