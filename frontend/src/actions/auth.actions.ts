/**
 * Server Actions for Authentication
 * Next.js Full-Stack Architecture
 * TODO: Replace with NextAuth.js in production
 */

'use server'

import { prisma } from '../lib/prisma'
import { cookies } from 'next/headers'
import { hash, compare } from 'bcryptjs'
import { cache } from '../lib/redis'
import { revalidatePath } from 'next/cache'

// ============================================
// AUTHENTICATION ACTIONS
// ============================================

/**
 * Register new user
 */
export async function register(data: {
  username: string
  email?: string
  password: string
  phone?: string
  firstName?: string
  lastName?: string
}) {
  // Validate input
  if (!data.username || data.username.length < 3) {
    throw new Error('Username must be at least 3 characters')
  }

  if (!data.password || data.password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }

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

  // Create user
  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      phone: data.phone,
      firstName: data.firstName,
      lastName: data.lastName,
      roleType: 'USER',
      isActive: true,
      isVerified: false,
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      roleType: true,
      createdAt: true,
    },
  })

  return {
    success: true,
    user,
    message: 'Registration successful',
  }
}

/**
 * Login user
 */
export async function login(data: {
  username: string
  password: string
  rememberMe?: boolean
}) {
  // Find user by username or email
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { username: data.username },
        { email: data.username },
      ],
    },
    select: {
      id: true,
      username: true,
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      roleType: true,
      isActive: true,
      isVerified: true,
      failedLoginAttempts: true,
      lockedUntil: true,
    },
  })

  if (!user) {
    throw new Error('Invalid username or password')
  }

  // Check if account is locked
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000)
    throw new Error(`Account is locked. Try again in ${minutesLeft} minutes`)
  }

  // Check if account is active
  if (!user.isActive) {
    throw new Error('Account is deactivated. Please contact support')
  }

  // Verify password
  if (!user.password) {
    throw new Error('Password not set for this account')
  }

  const isValidPassword = await compare(data.password, user.password)

  if (!isValidPassword) {
    // Increment failed login attempts
    const failedAttempts = (user.failedLoginAttempts || 0) + 1
    const updateData: any = {
      failedLoginAttempts: failedAttempts,
    }

    // Lock account after 5 failed attempts
    if (failedAttempts >= 5) {
      updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    })

    throw new Error('Invalid username or password')
  }

  // Reset failed login attempts and update last login
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(),
    },
  })

  // Create session token (simplified - use proper JWT in production)
  const sessionToken = `session_${user.id}_${Date.now()}`

  // Store session in cookies
  const cookieStore = await cookies()
  const maxAge = data.rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days or 1 day

  cookieStore.set('session-token', sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  })

  // Cache user session
  await cache.set(`session:${sessionToken}`, {
    userId: user.id,
    username: user.username,
    email: user.email,
    roleType: user.roleType,
  }, maxAge)

  return {
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleType: user.roleType,
    },
    message: 'Login successful',
  }
}

/**
 * Logout user
 */
export async function logout() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session-token')?.value

  if (sessionToken) {
    // Remove session from cache
    await cache.del(`session:${sessionToken}`)
  }

  // Clear session cookie
  cookieStore.delete('session-token')

  revalidatePath('/', 'layout')

  return {
    success: true,
    message: 'Logged out successfully',
  }
}

/**
 * Check if user is authenticated
 */
export async function checkAuth() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('session-token')?.value

  if (!sessionToken) {
    return { authenticated: false }
  }

  // Get session from cache
  const session = await cache.get<any>(`session:${sessionToken}`)

  if (!session) {
    return { authenticated: false }
  }

  // Verify user still exists and is active
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
      roleType: true,
      isActive: true,
    },
  })

  if (!user || !user.isActive) {
    // Invalid session, logout
    await logout()
    return { authenticated: false }
  }

  return {
    authenticated: true,
    user,
  }
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, username: true },
  })

  if (!user) {
    // Don't reveal if email exists for security
    return {
      success: true,
      message: 'If the email exists, a password reset link has been sent',
    }
  }

  // Generate reset token
  const resetToken = `reset_${user.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`

  // Store reset token in cache (expires in 1 hour)
  await cache.set(`password-reset:${resetToken}`, {
    userId: user.id,
    email: user.email,
  }, 3600)

  // TODO: Send email with reset link
  // const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
  // await sendEmail(user.email, 'Password Reset', resetUrl)

  console.log(`Password reset token for ${user.email}: ${resetToken}`)

  return {
    success: true,
    message: 'If the email exists, a password reset link has been sent',
    // Remove in production:
    resetToken, // For testing only
  }
}

/**
 * Verify password reset token
 */
export async function verifyResetToken(token: string) {
  const resetData = await cache.get<any>(`password-reset:${token}`)

  if (!resetData) {
    throw new Error('Invalid or expired reset token')
  }

  return {
    success: true,
    message: 'Token is valid',
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }

  // Get reset data from cache
  const resetData = await cache.get<any>(`password-reset:${token}`)

  if (!resetData) {
    throw new Error('Invalid or expired reset token')
  }

  // Hash new password
  const hashedPassword = await hash(newPassword, 10)

  // Update user password
  await prisma.user.update({
    where: { id: resetData.userId },
    data: {
      password: hashedPassword,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  })

  // Delete reset token
  await cache.del(`password-reset:${token}`)

  return {
    success: true,
    message: 'Password reset successfully',
  }
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string) {
  // Get verification data from cache
  const verifyData = await cache.get<any>(`email-verify:${token}`)

  if (!verifyData) {
    throw new Error('Invalid or expired verification token')
  }

  // Update user verification status
  await prisma.user.update({
    where: { id: verifyData.userId },
    data: { isVerified: true },
  })

  // Delete verification token
  await cache.del(`email-verify:${token}`)

  return {
    success: true,
    message: 'Email verified successfully',
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, isVerified: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  if (user.isVerified) {
    throw new Error('Email already verified')
  }

  // Generate verification token
  const verifyToken = `verify_${user.id}_${Date.now()}_${Math.random().toString(36).substring(7)}`

  // Store verification token in cache (expires in 24 hours)
  await cache.set(`email-verify:${verifyToken}`, {
    userId: user.id,
    email: user.email,
  }, 86400)

  // TODO: Send email with verification link
  // const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyToken}`
  // await sendEmail(user.email, 'Email Verification', verifyUrl)

  console.log(`Email verification token for ${user.email}: ${verifyToken}`)

  return {
    success: true,
    message: 'Verification email sent',
    // Remove in production:
    verifyToken, // For testing only
  }
}
