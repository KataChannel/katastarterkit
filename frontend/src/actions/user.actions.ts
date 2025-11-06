/**
 * Server Actions for User Management
 * Next.js Full-Stack Architecture
 */

'use server'

import { prisma } from '../lib/prisma'
import { cache } from '../lib/redis'
import { revalidatePath } from 'next/cache'
import { requireAuth, requireRole } from '../lib/auth'
import { hash } from 'bcryptjs'

// ============================================
// GET ACTIONS (Admin only)
// ============================================

/**
 * Get all users with pagination
 */
export async function getUsers({
  page = 1,
  limit = 20,
  roleType,
  isActive,
  search,
}: {
  page?: number
  limit?: number
  roleType?: string
  isActive?: boolean
  search?: string
} = {}) {
  await requireRole('admin')

  const skip = (page - 1) * limit

  const where: any = {}
  
  if (roleType) where.roleType = roleType
  if (isActive !== undefined) where.isActive = isActive
  if (search) {
    where.OR = [
      { username: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        roleType: true,
        isActive: true,
        isVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.user.count({ where }),
  ])

  return { users, total }
}

/**
 * Get single user by ID
 */
export async function getUserById(id: string) {
  const currentUser = await requireAuth()
  
  // Only allow users to view their own profile or admins to view any
  if (currentUser.id !== id && currentUser.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      phone: true,
      firstName: true,
      lastName: true,
      avatar: true,
      roleType: true,
      isActive: true,
      isVerified: true,
      isTwoFactorEnabled: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) throw new Error('User not found')

  return user
}

/**
 * Get user profile (current user)
 */
export async function getProfile() {
  const currentUser = await requireAuth()

  const cacheKey = `user:profile:${currentUser.id}`
  const cached = await cache.get<any>(cacheKey)
  if (cached) return cached

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: {
      id: true,
      email: true,
      username: true,
      phone: true,
      firstName: true,
      lastName: true,
      avatar: true,
      roleType: true,
      isActive: true,
      isVerified: true,
      isTwoFactorEnabled: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  if (!user) throw new Error('User not found')

  await cache.set(cacheKey, user, 600) // 10 minutes

  return user
}

// ============================================
// MUTATION ACTIONS
// ============================================

/**
 * Create new user (Admin only)
 */
export async function createUser(data: {
  username: string
  email?: string
  password: string
  phone?: string
  firstName?: string
  lastName?: string
  roleType?: string
  isActive?: boolean
}) {
  await requireRole('admin')

  // Check if username already exists
  const existingUsername = await prisma.user.findUnique({
    where: { username: data.username },
  })
  if (existingUsername) {
    throw new Error('Username already exists')
  }

  // Check if email already exists
  if (data.email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (existingEmail) {
      throw new Error('Email already exists')
    }
  }

  // Hash password
  const hashedPassword = await hash(data.password, 10)

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      roleType: data.roleType as any || 'USER',
      isActive: data.isActive ?? true,
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      roleType: true,
      isActive: true,
      createdAt: true,
    },
  })

  revalidatePath('/admin/users')

  return user
}

/**
 * Update user (Admin or self)
 */
export async function updateUser(
  id: string,
  data: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    avatar?: string
    roleType?: string
    isActive?: boolean
  }
) {
  const currentUser = await requireAuth()

  // Only allow users to update their own profile or admins to update any
  const isOwnProfile = currentUser.id === id
  const isAdmin = currentUser.role === 'admin'

  if (!isOwnProfile && !isAdmin) {
    throw new Error('Unauthorized')
  }

  // Non-admins cannot change roleType or isActive
  if (!isAdmin) {
    delete data.roleType
    delete data.isActive
  }

  // Check email uniqueness if changing
  if (data.email) {
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: data.email,
        id: { not: id },
      },
    })
    if (existingEmail) {
      throw new Error('Email already exists')
    }
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      email: data.email,
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      avatar: data.avatar,
      roleType: data.roleType as any,
      isActive: data.isActive,
    },
    select: {
      id: true,
      email: true,
      username: true,
      phone: true,
      firstName: true,
      lastName: true,
      avatar: true,
      roleType: true,
      isActive: true,
      updatedAt: true,
    },
  })

  // Invalidate cache
  await cache.del(`user:profile:${id}`)

  revalidatePath('/admin/users')
  revalidatePath('/profile')

  return user
}

/**
 * Change password (own account only)
 */
export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}) {
  const currentUser = await requireAuth()

  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { password: true },
  })

  if (!user?.password) {
    throw new Error('User not found or password not set')
  }

  // Verify current password
  const bcrypt = require('bcryptjs')
  const isValid = await bcrypt.compare(data.currentPassword, user.password)
  if (!isValid) {
    throw new Error('Current password is incorrect')
  }

  // Hash new password
  const hashedPassword = await hash(data.newPassword, 10)

  await prisma.user.update({
    where: { id: currentUser.id },
    data: { password: hashedPassword },
  })

  return { success: true }
}

/**
 * Delete user (Admin only)
 */
export async function deleteUser(id: string) {
  await requireRole('admin')

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new Error('User not found')

  // Cannot delete yourself
  const currentUser = await requireAuth()
  if (currentUser.id === id) {
    throw new Error('Cannot delete your own account')
  }

  await prisma.user.delete({ where: { id } })

  // Invalidate cache
  await cache.del(`user:profile:${id}`)

  revalidatePath('/admin/users')

  return { success: true }
}

/**
 * Toggle user active status (Admin only)
 */
export async function toggleUserStatus(id: string) {
  await requireRole('admin')

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw new Error('User not found')

  // Cannot deactivate yourself
  const currentUser = await requireAuth()
  if (currentUser.id === id) {
    throw new Error('Cannot deactivate your own account')
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
    select: {
      id: true,
      username: true,
      isActive: true,
    },
  })

  // Invalidate cache
  await cache.del(`user:profile:${id}`)

  revalidatePath('/admin/users')

  return updated
}

/**
 * Get user statistics (Admin only)
 */
export async function getUserStats() {
  await requireRole('admin')

  const cacheKey = 'users:stats'
  const cached = await cache.get<any>(cacheKey)
  if (cached) return cached

  const [total, active, verified, admins] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { isVerified: true } }),
    prisma.user.count({ where: { roleType: 'ADMIN' } }),
  ])

  const stats = {
    total,
    active,
    inactive: total - active,
    verified,
    unverified: total - verified,
    admins,
  }

  await cache.set(cacheKey, stats, 300) // 5 minutes

  return stats
}
