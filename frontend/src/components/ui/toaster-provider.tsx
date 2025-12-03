"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'
import { Toaster } from './sonner'

/**
 * ToasterProvider - Wrapper for Sonner Toaster with auto-dismiss on route change
 * Prevents stale toasts from persisting when navigating between pages
 */
export function ToasterProvider() {
  const pathname = usePathname()

  // Dismiss all toasts when route changes
  useEffect(() => {
    // Small delay to allow any route-specific toasts to show first
    const timer = setTimeout(() => {
      toast.dismiss()
    }, 100)

    return () => clearTimeout(timer)
  }, [pathname])

  return <Toaster />
}
