'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { hash, compare } from 'bcryptjs'
import type { Prisma } from '@prisma/client'

// ============================================================================
// USER QUERIES
// ============================================================================

export async function getUsers(options?: {
  skip?: number
  take?: number
  where?: Prisma.UserWhereInput
  orderBy?: Prisma.UserOrderByWithRelationInput
}) {
  try {
    const users = await prisma.user.findMany({
      skip: options?.skip,
      take: options?.take ?? 20,
      where: options?.where ?? {},
      orderBy: options?.orderBy ?? { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        phone: true,
        roleType: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    const total = await prisma.user.count({
      where: options?.where ?? {},
    })

    return {
      success: true,
      data: users,
      total,
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return {
      success: false,
      error: 'Failed to fetch users',
    }
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        phone: true,
        roleType: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      }
    }

    return {
      success: true,
      data: user,
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return {
      success: false,
      error: 'Failed to fetch user',
    }
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        phone: true,
        roleType: true,
        isActive: true,
        isVerified: true,
      },
    })

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      }
    }

    return {
      success: true,
      data: user,
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return {
      success: false,
      error: 'Failed to fetch user',
    }
  }
}

// ============================================================================
// USER MUTATIONS
// ============================================================================

export async function createUser(data: {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
  role?: string
}) {
  try {
    const hashedPassword = await hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        roleType: (data.role as any) ?? 'USER',
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        roleType: true,
      },
    })

    revalidatePath('/admin/users')

    return {
      success: true,
      data: user,
    }
  } catch (error: any) {
    console.error('Error creating user:', error)
    
    if (error.code === 'P2002') {
      return {
        success: false,
        error: 'Email or username already exists',
      }
    }

    return {
      success: false,
      error: 'Failed to create user',
    }
  }
}

export async function updateUser(
  id: string,
  data: {
    username?: string
    email?: string
    firstName?: string
    lastName?: string
    phone?: string
    avatar?: string
    role?: string
    isActive?: boolean
  }
) {
  try {
    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        phone: true,
        roleType: true,
        isActive: true,
      },
    })

    revalidatePath('/admin/users')
    revalidatePath(`/admin/users/${id}`)

    return {
      success: true,
      data: user,
    }
  } catch (error: any) {
    console.error('Error updating user:', error)
    
    if (error.code === 'P2002') {
      return {
        success: false,
        error: 'Email or username already exists',
      }
    }

    return {
      success: false,
      error: 'Failed to update user',
    }
  }
}

export async function deleteUser(id: string) {
  try {
    // Soft delete
    await prisma.user.update({
      where: { id },
      data: {
        // Hard delete - use prisma.user.delete instead,
        isActive: false,
      },
    })

    revalidatePath('/admin/users')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    return {
      success: false,
      error: 'Failed to delete user',
    }
  }
}

export async function updateUserPassword(
  userId: string,
  oldPassword: string,
  newPassword: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user || !user.password) {
      return {
        success: false,
        error: 'User not found or no password set',
      }
    }

    const isValid = await compare(oldPassword, user.password)

    if (!isValid) {
      return {
        success: false,
        error: 'Invalid old password',
      }
    }

    const hashedPassword = await hash(newPassword, 12)

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('Error updating password:', error)
    return {
      success: false,
      error: 'Failed to update password',
    }
  }
}
