'use server'

import { prisma } from '@/lib/prisma'
import { hash, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// ============================================================================
// AUTHENTICATION
// ============================================================================

export async function login(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return {
        success: false,
        error: 'Invalid credentials',
      }
    }

    if (!user.isActive) {
      return {
        success: false,
        error: 'Account is inactive',
      }
    }

    const isValidPassword = await compare(password, user.password)

    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid credentials',
      }
    }

    // Create JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

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
          role: user.role,
        },
        token,
      },
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'Failed to login',
    }
  }
}

export async function register(data: {
  email: string
  password: string
  username: string
  firstName?: string
  lastName?: string
  phone?: string
}) {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username },
        ],
      },
    })

    if (existingUser) {
      return {
        success: false,
        error: 'Email or username already exists',
      }
    }

    // Hash password
    const hashedPassword = await hash(data.password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: 'USER',
      },
    })

    // Create JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

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
          role: user.role,
        },
        token,
      },
    }
  } catch (error: any) {
    console.error('Registration error:', error)
    
    if (error.code === 'P2002') {
      return {
        success: false,
        error: 'Email or username already exists',
      }
    }

    return {
      success: false,
      error: 'Failed to register',
    }
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('auth-token')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Logout error:', error)
    return {
      success: false,
      error: 'Failed to logout',
    }
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return {
        success: false,
        error: 'Not authenticated',
      }
    }

    // Verify token
    const { verify } = await import('jsonwebtoken')
    const decoded = verify(token, JWT_SECRET) as any

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
      },
    })

    if (!user || !user.isActive) {
      return {
        success: false,
        error: 'User not found or inactive',
      }
    }

    return {
      success: true,
      data: user,
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return {
      success: false,
      error: 'Failed to get current user',
    }
  }
}

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Don't reveal if user exists
      return {
        success: true,
        message: 'If the email exists, a password reset link has been sent',
      }
    }

    // Generate reset token
    const resetToken = sign(
      { userId: user.id, type: 'PASSWORD_RESET' },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    // In a real app, send email with reset link
    // For now, just return the token
    console.log('Password reset token:', resetToken)

    return {
      success: true,
      message: 'If the email exists, a password reset link has been sent',
      // In development, return token
      ...(process.env.NODE_ENV === 'development' && { token: resetToken }),
    }
  } catch (error) {
    console.error('Password reset error:', error)
    return {
      success: false,
      error: 'Failed to request password reset',
    }
  }
}

export async function resetPassword(token: string, newPassword: string) {
  try {
    const { verify } = await import('jsonwebtoken')
    const decoded = verify(token, JWT_SECRET) as any

    if (decoded.type !== 'PASSWORD_RESET') {
      return {
        success: false,
        error: 'Invalid token',
      }
    }

    const hashedPassword = await hash(newPassword, 12)

    await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        password: hashedPassword,
      },
    })

    return {
      success: true,
      message: 'Password has been reset successfully',
    }
  } catch (error) {
    console.error('Reset password error:', error)
    return {
      success: false,
      error: 'Failed to reset password. Token may be invalid or expired.',
    }
  }
}
