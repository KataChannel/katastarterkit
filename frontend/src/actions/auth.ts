'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { cache } from '@/lib/redis'

export async function loginWithGoogle(input: {
  token: string
  email: string
  providerId: string
  firstName?: string
  lastName?: string
  avatar?: string
}) {
  try {
    let user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { authMethods: true },
    })

    let isNewUser = false

    if (!user) {
      isNewUser = true
      const baseUsername = input.email.split('@')[0]
      const randomSuffix = Math.random().toString(36).substring(2, 7)
      const username = baseUsername + '_' + randomSuffix
      
      user = await prisma.user.create({
        data: {
          email: input.email,
          username: username,
          firstName: input.firstName || '',
          lastName: input.lastName || '',
          avatar: input.avatar,
          password: '',
          roleType: 'USER',
          isActive: true,
          isVerified: true,
          authMethods: {
            create: {
              provider: 'GOOGLE',
              providerId: input.providerId,
              accessToken: input.token,
            },
          },
        },
        include: { authMethods: true },
      })
    } else {
      const googleAuth = user.authMethods.find((auth) => auth.provider === 'GOOGLE')

      if (!googleAuth) {
        await prisma.authMethod.create({
          data: {
            userId: user.id,
            provider: 'GOOGLE',
            providerId: input.providerId,
            accessToken: input.token,
          },
        })
      } else {
        await prisma.authMethod.update({
          where: { id: googleAuth.id },
          data: { accessToken: input.token },
        })
      }

      if (!user.avatar && input.avatar) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { avatar: input.avatar, isVerified: true },
          include: { authMethods: true },
        })
      }
    }

    if (!user.isActive) {
      return { success: false, error: 'Account is disabled' }
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    // Create session token (same as login() in auth.actions.ts)
    const sessionToken = `session_${user.id}_${Date.now()}`

    // Store session in cookies
    const cookieStore = await cookies()
    const maxAge = 30 * 24 * 60 * 60 // 30 days for OAuth

    cookieStore.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge,
      path: '/',
    })

    // Cache user session (same structure as auth.actions.ts)
    await cache.set(`session:${sessionToken}`, {
      userId: user.id,
      username: user.username,
      email: user.email,
      roleType: user.roleType,
    }, maxAge)

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          roleType: user.roleType,
          createdAt: user.createdAt.toISOString(),
        },
        isNewUser,
      },
    }
  } catch (error: any) {
    console.error('Google login error:', error)
    
    if (error.code === 'P2002') {
      return { success: false, error: 'Email already exists with different provider' }
    }

    return { success: false, error: 'Failed to login with Google' }
  }
}
